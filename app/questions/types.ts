export type QuestionType = 'text' | 'select' | 'multiChoice' | 'diagnosisTime' | 'medications' | 'familyHistory'

export interface Question {
  id: string
  title: string
  type: QuestionType
  options?: string[]
  placeholder?: string
}

export interface Answers {
  name: string
  age: string
  diagnosis: string[]
  diagnosisLength: Record<string, string>
  medications: string[]
  familyHistory: { hasHistory: boolean | null; details: string }
}
