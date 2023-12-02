import { Room, Player } from "../types"

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
        selectedQuestions: [],
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
    selectedQuestions: [],
  })

  return room
}

export function leaveRoom(roomId: string, userId: string) {
  const room = rooms.find((room) => room.id === roomId)

  if (!room) {
    return false
  }

  room.players = room.players.filter((player) => player.id !== userId)

  return true
}

export function getRooms() {
  return rooms
}
