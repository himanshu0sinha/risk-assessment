'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { StarRating } from '@/components/star-rating'
import { Question, SurveyAnswers, QuestionOption } from '@/types/survey'

const questions: Question[] = [
  {
    id: 'income',
    question: 'What is your monthly income?',
    type: 'select',
    options: [
      { value: 'low', label: 'Less than ₹30,000' },
      { value: 'medium-low', label: '₹30,000 - ₹60,000' },
      { value: 'medium-high', label: '₹60,000 - ₹100,000' },
      { value: 'high', label: '₹100,000 - ₹200,000' },
      { value: 'very-high', label: 'More than ₹200,000' },
    ],
  },
  {
    id: 'savings',
    question: 'How much do you save each month?',
    type: 'slider',
    min: 0,
    max: 50,
    step: 5,
    unit: '%',
  },
  {
    id: 'risk_appetite',
    question: 'How would you describe your risk appetite for investments?',
    type: 'radio',
    options: [
      { value: 'conservative', label: 'Conservative - I prefer low-risk investments' },
      { value: 'moderate', label: 'Moderate - I can tolerate some risk for potentially higher returns' },
      { value: 'aggressive', label: 'Aggressive - I\'m comfortable with high-risk, high-reward investments' },
    ],
  },
  {
    id: 'financial_goals',
    question: 'What are your primary financial goals? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'emergency_fund', label: 'Build an emergency fund' },
      { value: 'retirement', label: 'Save for retirement' },
      { value: 'home', label: 'Buy a home' },
      { value: 'debt', label: 'Pay off debt' },
      { value: 'invest', label: 'Invest for wealth growth' },
      { value: 'education', label: 'Save for education' },
      { value: 'travel', label: 'Save for travel' },
    ],
  },
  {
    id: 'debt',
    question: 'Do you have any outstanding debt?',
    type: 'radio',
    options: [
      { value: 'none', label: 'No debt' },
      { value: 'low', label: 'Low debt (less than ₹50,000)' },
      { value: 'medium', label: 'Moderate debt (₹1,00,000 - ₹5,00,000)' },
      { value: 'high', label: 'High debt (more than ₹5,00,000)' },
    ],
  },
  {
    id: 'financial_knowledge',
    question: 'How would you rate your financial knowledge?',
    type: 'stars',
    max: 5,
  },
  {
    id: 'retirement_age',
    question: 'At what age do you plan to retire?',
    type: 'number',
    min: 50,
    max: 80,
  },
  {
    id: 'investment_experience',
    question: 'How many years of investment experience do you have?',
    type: 'select',
    options: [
      { value: 'none', label: 'No experience' },
      { value: 'beginner', label: 'Less than 2 years' },
      { value: 'intermediate', label: '2-5 years' },
      { value: 'experienced', label: '5-10 years' },
      { value: 'expert', label: 'More than 10 years' },
    ],
  },
  {
    id: 'income_stability',
    question: 'How stable is your current income?',
    type: 'radio',
    options: [
      { value: 'very-unstable', label: 'Very unstable' },
      { value: 'somewhat-unstable', label: 'Somewhat unstable' },
      { value: 'stable', label: 'Stable' },
      { value: 'very-stable', label: 'Very stable' },
    ],
  },
  {
    id: 'financial_priorities',
    question: 'Rank your financial priorities (1 being highest)',
    type: 'ranking',
    options: [
      { value: 'saving', label: 'Saving' },
      { value: 'investing', label: 'Investing' },
      { value: 'debt_repayment', label: 'Debt Repayment' },
      { value: 'budgeting', label: 'Budgeting' },
      { value: 'financial_education', label: 'Financial Education' },
    ],
  },
]

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const router = useRouter()

  const handleAnswer = (questionId: string, answer: string | number | string[] | QuestionOption[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitSurvey()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitSurvey = async () => {
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/results?id=${result.id}`)
      } else {
        console.error('Failed to submit survey')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
    }
  }

  const question = questions[currentQuestion]

  const renderQuestion = () => {
    switch (question.type) {
      case 'select':
        return (
          <Select onValueChange={(value) => handleAnswer(question.id, value)} value={answers[question.id] as string || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'radio':
        return (
          <RadioGroup onValueChange={(value) => handleAnswer(question.id, value)} value={answers[question.id] as string || ''}>
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(answers[question.id] as string[] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = answers[question.id] as string[] || []
                    const newValue = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v) => v !== option.value)
                    handleAnswer(question.id, newValue)
                  }}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case 'slider':
        return (
          <div className="space-y-4">
            <Slider
              min={question.min}
              max={question.max}
              step={question.step}
              value={[answers[question.id] as number || 0]}
              onValueChange={(value) => handleAnswer(question.id, value[0])}
            />
            <div className="text-center text-lg font-semibold">
              {question.type === 'slider' ? (answers[question.id] as number || 0) : 0}{question.unit}
            </div>
          </div>
        )
      case 'stars':
        return (
          <StarRating
            max={question.max || 5}
            value={answers[question.id] as number || 0}
            onChange={(value) => handleAnswer(question.id, value)}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            min={question.min}
            max={question.max}
            value={answers[question.id] as number || ''}
            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value, 10))}
          />
        )
      case 'ranking':
        return (
          <DragDropContext onDragEnd={(result: DropResult) => {
            if (!result.destination) return
            const items = Array.from(answers[question.id] as QuestionOption[] || question.options || [])
            const [reorderedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, reorderedItem)
            handleAnswer(question.id, items)
          }}>
            <Droppable droppableId="ranking">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {(answers[question.id] as QuestionOption[] || question.options || []).map((item, index) => (
                    <Draggable key={item.value} draggableId={item.value} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 rounded shadow"
                        >
                          {index + 1}. {item.label}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white bg-opacity-90 backdrop-blur-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Question {currentQuestion + 1} of {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div key={currentQuestion} className="transition-opacity duration-300 ease-in-out">
            <h2 className="text-xl mb-4">{question.question}</h2>
            {renderQuestion()}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
