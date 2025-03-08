import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("connected");

  ws.on("message", (message) => {
    console.log("New Message Received:", message.toString());
    wss.clients.forEach((client) => {
      if (client === ws || client.readyState === WebSocket.OPEN) {
        return;
      }

      client.send(message);
    })
  });

  ws.on("close", () => {
    console.log("disconnected");
  });
});

server.listen(8080, () => {
  console.log("웹소켓 서버 실행 중: ws://localhost:8080");
});
