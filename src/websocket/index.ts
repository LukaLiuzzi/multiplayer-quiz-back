import { Server } from "socket.io"
import { createRoom, joinRoom, leaveRoom } from "../game"
import { Server as HttpServer } from "http"

const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
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
        socket.emit("room-joined", room)
      } else {
        socket.emit("room-not-found")
      }
    })

    socket.on("leave-room", (userId, roomId) => {
      const room = leaveRoom(roomId, userId)

      if (room) {
        socket.leave(roomId)
        socket.emit("room-left")
      } else {
        socket.emit("room-not-found")
      }
    })
  })
}

export default setupWebSocket
