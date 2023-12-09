import { Server } from "socket.io"
import {
  createRoom,
  joinRoom,
  leaveRoom,
  saveQuestions,
  startGame,
} from "../game"
import { Server as HttpServer } from "http"

const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 15000,
    },
  })

  io.on("connection", (socket) => {
    console.log("USUARIO CONECTADO =>", socket.id)

    socket.on("create-room", (userId) => {
      const room = createRoom(userId)
      socket.join(room.id)
      console.log("ROOM CREADA =>", room)
      socket.emit("room-created", room)
    })

    socket.on("join-room", (roomId, userId) => {
      const room = joinRoom(roomId, userId)

      if (room) {
        console.log("ROOM JOINED =>", room)
        socket.join(roomId)
        io.to(roomId).emit("room-joined", room) // Broadcast to all in the room
      } else {
        socket.emit("room-not-found")
      }
    })

    socket.on("leave-room", (userId, roomId) => {
      const room = leaveRoom(roomId, userId)

      if (room) {
        socket.leave(roomId)
        io.to(roomId).emit("room-left", room)
      } else {
        socket.emit("room-not-found")
      }
    })

    socket.on("start-game", (roomId) => {
      const room = startGame(roomId)

      if (room) {
        io.to(roomId).emit("game-started", room)
      } else {
        socket.emit("room-error")
      }
    })

    socket.on("send-questions", ({ questions, roomId }) => {
      const room = saveQuestions(questions, roomId, socket.id)

      if (room) {
        io.to(roomId).emit("questions-sent", room)
      } else {
        socket.emit("room-error")
      }
    })
  })
}

export default setupWebSocket
