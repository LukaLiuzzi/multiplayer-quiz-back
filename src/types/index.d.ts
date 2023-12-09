export interface Player {
  id: string
  questions: Question[]
}

export interface Room {
  id: string
  owner: string
  players: Player[]
  state: "waiting" | "question" | "answer" | "finished"
}

export interface Answer {
  text: string
  isCorrect: boolean
}

export interface Question {
  question: string
  answers: Answer[]
}
