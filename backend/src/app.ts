import express from "express";
import { createServer } from "http";
import WebSocket from "ws";
import cors from "cors";

import db from "./database";

const app = express();

app.use(express.json());
app.use(cors());

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map<number, Set<WebSocket>>();

server.listen(8080, () => {
  console.log("웹소켓 서버 실행 중: ws://localhost:8080");
});

// 모든 채팅방
app.get('/api/rooms', (req, res) => {
  db.all("SELECT * FROM rooms", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 채팅방 생성
app.post('/api/create-room', (req, res) => {
  const { roomName } = req.body;

  db.run("INSERT INTO rooms (name) VALUES (?)", [roomName], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/room/:room_id', (req, res) => {
  const { room_id } = req.params;
  db.get(
    "SELECT * FROM rooms WHERE id = ?", 
    [Number(room_id)], 
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    }
  );
});

//채팅방의 메시지 
app.get('/api/room/:room_id/messages', (req, res) => {
  const { room_id } = req.params;
  db.all(
    "SELECT * FROM messages WHERE room_id = ? ORDER BY sent_at ASC", 
    [Number(room_id)], 
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

wss.on("connection", (ws, req) => {
  const searchParameters = new URLSearchParams(req.url?.split("?")[1]);
  let roomIdParam = searchParameters.get("roomId");

  if (roomIdParam === null) {
    ws.close(4000, "roomId is required");
    return;
  }
  const roomId = Number(roomIdParam);

  console.log(`connected to room ${roomId}`);

  if (rooms.has(roomId)) {
    rooms.get(roomId)?.add(ws);
  } else {
    rooms.set(roomId, new Set([ws]));
  }

  ws.on("message", (data) => {
    console.log("New Message Received:", data.toString());

    const { roomId, userName, message } = JSON.parse(data.toString());
    db.run(
      "INSERT INTO messages (room_id, username, message) VALUES (?, ?, ?)", 
      [roomId, userName, message], 
      function(err) {
        // 에러 처리
      }
    );

    const clients = rooms.get(roomId);
    if (!clients) {
      return;
    }

    for (const client of clients) {
      if (client === ws || client.readyState !== WebSocket.OPEN) {
        continue;
      }
      client.send(data);
    }
  });

  ws.on("close", () => {
    console.log("disconnected");
    rooms.get(roomId)?.delete(ws);
    if (rooms.get(roomId)?.size === 0) {
      rooms.delete(roomId);
    }
  });
});
