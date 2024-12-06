export type QuestionType = 'select' | 'radio' | 'checkbox' | 'slider' | 'stars' | 'number' | 'ranking';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface SurveyAnswers {
  [key: string]: string | number | string[] | QuestionOption[];
}
