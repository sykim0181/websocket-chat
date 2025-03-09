import { Message, SimplifiedMessage } from "./types";

export function simplifyMessage(message: Message): SimplifiedMessage {
  return {
    roomId: message.room_id,
    userName: message.username,
    message: message.message
  };
}