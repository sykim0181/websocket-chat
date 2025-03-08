import express from "express";
import http from "http";
import WebSocket from "ws";
import cors from "cors";
import { v4 as uuid4 } from "uuid";

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map();

app.get('/api/rooms', (req, res) => {
  res.json(Array.from(rooms.values()));
});

app.post('/api/create-room', (req, res) => {
  const { roomName } = req.body;

  const id = uuid4();
  const room = {
    id,
    name: roomName
  };

  if (!rooms.has(roomName)) {
    rooms.set(id, room);
  }

  res.json({ room });
});

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
