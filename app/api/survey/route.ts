import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import clientPromise from '@/lib/mongodb'
import { SurveyResult } from '@/models/SurveyResult'
import { ObjectId } from 'mongodb'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: Request) {
  const answers = await request.json()

  // Process the answers using Gemini Flash
  const results = await processAnswersWithGemini(answers)

  // Store the results in MongoDB
  const client = await clientPromise
  const db = client.db("financial_survey")
  const surveyResults = db.collection<SurveyResult>("survey_results")

  const newSurveyResult: SurveyResult = {
    answers,
    results,
    createdAt: new Date()
  }

  const result = await surveyResults.insertOne(newSurveyResult)

  return NextResponse.json({ id: result.insertedId.toString() })
}

async function processAnswersWithGemini(answers: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
    Analyze the following financial survey responses and provide personalized insights:
    ${JSON.stringify(answers, null, 2)}

    Please provide the following insights:
    1. Risk Profile
    2. Savings Habits
    3. Investment Strategy
    4. Debt Management
    5. A list of 5 personalized recommendations

    Format the response as a JSON object with the following structure:
    {
      "riskProfile": "...",
      "savingsHabits": "...",
      "investmentStrategy": "...",
      "debtManagement": "...",
      "recommendations": [
        "...",
        "...",
        "...",
        "...",
        "..."
      ],
    }
    `

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()
  console.log(text)
  const cleanText = text
  .replace(/^```(?:json)?\s*/i, '') // Remove starting ```json with optional whitespace
  .replace(/```\s*$/gm, '')         // Remove ending ``` with optional whitespace
  .replace(/^```|```$/gm, '')       // Remove any remaining backticks
  .trim()
  console.log(cleanText)
  try {
    return JSON.parse(cleanText)
  } catch (error) {
    console.error('Error parsing Gemini response:', error)
    return {
      riskProfile: 'Unable to determine',
      savingsHabits: 'Unable to determine',
      investmentStrategy: 'Unable to determine',
      debtManagement: 'Unable to determine',
      recommendations: ['Unable to generate recommendations'],
    }
  }
}
