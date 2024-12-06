import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { SurveyResult } from '@/models/SurveyResult'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const client = await clientPromise
    const db = client.db("financial_survey")
    const surveyResults = db.collection<SurveyResult>("survey_results")

    const result = await surveyResults.findOne({ _id: new ObjectId(id) })

    if (!result) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(result.results)
  } catch (error) {
    console.error('Error retrieving survey results:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
