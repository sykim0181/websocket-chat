import sqlite3 from "sqlite3";

const Sqlite3 = sqlite3.verbose();

const db = new Sqlite3.Database("ChatRooms", (error) => {
  if (error) {
    console.error("데이터베이스 연결 실패:", error);
  } else {
    console.log("데이터 베이스 연결 성공");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    )  
  `);
});

export default db;
