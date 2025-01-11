import { Server } from "socket.io"
import {
  createRoom,
  joinRoom,
  leaveRoom,
  saveAnswers,
  saveQuestions,
  startGame,
} from "../game"
import { Server as HttpServer } from "http"
import { AnsweredQuestion, Question } from "../types"

const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "https://multiplayer-quiz-front.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/multiplayer-quiz-back/socket.io",
    connectionStateRecovery: {
      maxDisconnectionDuration: 15000,
    },
  })

  io.on("connection", (socket) => {
    console.log("USUARIO CONECTADO =>", socket.id)

    socket.on("create-room", (userId: string) => {
      const room = createRoom(userId)
      socket.join(room.id)
      console.log("ROOM CREADA =>", room)
      socket.emit("room-created", room)
    })

    socket.on("join-room", (roomId: string, userId: string) => {
      const room = joinRoom(roomId, userId)

      if (room) {
        console.log("ROOM JOINED =>", room)
        socket.join(roomId)
        io.to(roomId).emit("room-joined", room) // Broadcast to all in the room
      } else {
        socket.emit("room-not-found")
      }
    })

    socket.on("leave-room", (userId: string, roomId: string) => {
      const room = leaveRoom(roomId, userId)

      if (room) {
        socket.leave(roomId)
        io.to(roomId).emit("room-left", room)
      } else {
        socket.emit("room-not-found")
      }
    })

    socket.on("start-game", (roomId: string) => {
      const room = startGame(roomId)

      if (room) {
        io.to(roomId).emit("game-started", room)
      } else {
        socket.emit("room-error")
      }
    })

    socket.on(
      "send-questions",
      ({ questions, roomId }: { questions: Question[]; roomId: string }) => {
        const room = saveQuestions(questions, roomId, socket.id)

        if (room) {
          io.to(roomId).emit("questions-sent", room)
        } else {
          socket.emit("room-error")
        }
      }
    )

    socket.on(
      "send-answers",
      ({
        answeredQuestions,
        roomId,
      }: {
        answeredQuestions: AnsweredQuestion[]
        roomId: string
      }) => {
        const room = saveAnswers(answeredQuestions, roomId, socket.id)

        if (room) {
          io.to(roomId).emit("answers-sent", room)
        } else {
          socket.emit("room-error")
        }
      }
    )
  })
}

export default setupWebSocket
