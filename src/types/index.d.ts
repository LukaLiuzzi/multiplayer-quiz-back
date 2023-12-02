export interface Player {
  id: string
  selectedQuestions: string[]
}

export interface Room {
  id: string
  owner: string
  players: Player[]
  state: "waiting" | "playing" | "finished"
}
