export interface Player {
  id: string
  questions: Question[]
  answers: AnsweredQuestion[]
}

export interface Room {
  id: string
  owner: string
  players: Player[]
  state: "waiting" | "question" | "answer" | "score" | "finished"
}

export interface Answer {
  text: string
  isCorrect: boolean
}

export interface Question {
  question: string
  answers: Answer[]
}

export interface AnsweredQuestion {
  question: string
  answers: Answer[]
  correctAnswer: Answer
  playerAnswer: Answer
}
