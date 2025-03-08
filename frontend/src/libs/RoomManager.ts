import { Room } from "../types";

class RoomManager {
  constructor() {}

  public async getRooms() {
    const response = await fetch('/api/rooms');
      
    if (!response.ok) {
      throw new Error("방 목록 불러오기 실패");
    }
  
    const data = await response.json();
    console.log("방 목록:", data);
    return data as Room[];
  }

  public async createRoom(roomName: string) {
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ roomName })
    });
  
    if (!response.ok) {
      throw new Error("방 생성 실패");
    }
    
    const data = await response.json();
    console.log("방 생성 성공:", data);
    return data.room as Room;
  }
}

export default new RoomManager();