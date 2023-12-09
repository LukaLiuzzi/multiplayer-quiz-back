import { Room, Player, Question, AnsweredQuestion } from "../types"

const rooms: Room[] = []

export function generateId() {
  return Math.random().toString(36).substring(7)
}

export function createRoom(ownerId: string) {
  const room: Room = {
    id: generateId(),
    owner: ownerId,
    players: [
      {
        id: ownerId,
        questions: [],
        answers: [],
      },
    ],
    state: "waiting",
  }

  rooms.push(room)

  return room
}

export function joinRoom(roomId: string, userId: string) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return null
  }

  room.players.push({
    id: userId,
    questions: [],
    answers: [],
  })

  return room
}

export function leaveRoom(roomId: string, userId: string) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return false
  }

  room.players = room.players.filter((player) => player.id !== userId)

  if (room.players.length === 1) {
    room.owner = room.players[0].id
  }

  if (room.players.length === 0) {
    rooms.splice(rooms.indexOf(room), 1)
  }

  return room
}

export function startGame(roomId: string) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return null
  }

  if (room.players.length < 2) {
    return null
  }

  room.state = "question"

  return room
}

export function saveQuestions(
  questions: Question[],
  roomId: string,
  playerId: string
) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return null
  }

  const player = room.players.find((player) => player.id === playerId)

  if (!player) {
    return null
  }

  player.questions = questions

  if (
    room.players[0].questions.length > 0 &&
    room.players[1].questions.length > 0
  ) {
    room.state = "answer"
  }

  return room
}

export function saveAnswers(
  answeredQuestions: AnsweredQuestion[],
  roomId: string,
  playerId: string
) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return null
  }

  const player = room.players.find((player) => player.id === playerId)

  if (!player) {
    return null
  }

  player.answers = answeredQuestions

  if (
    room.players[0].answers.length > 0 &&
    room.players[1].answers.length > 0
  ) {
    room.state = "score"
  }

  return room
}

export function getRooms() {
  return rooms
}
