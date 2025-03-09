import { SimplifiedMessage } from "../types";

class ChatManager {
  private roomId: number;
  private socket: WebSocket;

  constructor(roomId: number) {
    this.roomId = roomId;
    this.socket = new WebSocket(`ws://localhost:8080?roomId=${roomId}`);

    this.socket.onopen = () => console.log(`Room ${roomId}: socket opened`);
    this.socket.onmessage = (ev) => console.log(`Room ${roomId}: ${ev.data}`);
    this.socket.onclose = () => console.log(`Room ${roomId}: socket closed`);
  }

  public sendMessage(userName: string, message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const data: SimplifiedMessage = {
        roomId: this.roomId,
        userName,
        message
      };
      this.socket.send(JSON.stringify(data));
    } else {
      throw new Error("websocket is not open");
    }
  }

  public leaveRoom() {
    this.socket.close();
  }

  public setOnMessageEventHandler(eventHandler: (message: SimplifiedMessage) => void) {
    this.socket.onmessage = async (ev) => {
      // TODO: data 타입에 맞게 변경
      const blob = ev.data as Blob;
      const text = await blob.text();
      const msg = JSON.parse(text);
      console.log(`Room ${this.roomId}:`, msg);
      eventHandler(msg);
    }
  }
}

export default ChatManager;