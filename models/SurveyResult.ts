import { ObjectId } from 'mongodb'

export interface SurveyResult {
  _id?: ObjectId
  answers: {
    [key: string]: any
  }
  results: {
    riskProfile: string
    savingsHabits: string
    investmentStrategy: string
    debtManagement: string
    recommendations: string[]
  }
  createdAt: Date
}
