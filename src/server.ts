import express from "express"
import { createServer } from "http"
import setupWebSocket from "./websocket"

const app = express()
const server = createServer(app)

setupWebSocket(server)

server.listen(8080, () => {
  console.log("listening on *:8080")
})
