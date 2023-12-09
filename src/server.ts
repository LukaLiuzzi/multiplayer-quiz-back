import express from "express"
import { createServer } from "http"
import setupWebSocket from "./websocket"

const app = express()
const server = createServer(app)

setupWebSocket(server)

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
