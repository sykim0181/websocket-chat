import { Message, Room } from "../types";

class RoomManager {
  constructor() {}

  public async getRooms(): Promise<Room[]> {
    const response = await fetch('/api/rooms');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`방 목록 불러오기 실패: ${data.error}`);
    }
  
    console.log("방 목록:", data);
    return data as Room[];
  }

  public async createRoom(roomName: string): Promise<number> {
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ roomName })
    });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(`방 생성 실패: ${data.error}`);
    }
    
    console.log("방 생성 성공:", data);
    return data.id as number;
  }

  public async getRoomMessage(roomId: number): Promise<Message[]> {
    const response = await fetch(`/api/room/${roomId}/messages`, {
      method: "GET",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`메세지 가져오기 실패: ${data.error}`);
    }

    return data as Message[];
  }

  public async getRoom(roomId: number): Promise<Room> {
    const response = await fetch(`/api/room/${roomId}`, {
      method: 'GET'
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`룸 정보 가져오기 실패: ${data.error}`);
    }
    return data as Room;
  }
}

export default new RoomManager();