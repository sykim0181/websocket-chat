export type Room = {
  id: number;
  name: string;
  created_at: Date;
};

export type Message = {
  id: number;
  room_id: number;
  username: string;
  message: string;
  sent_at: Date;
};

export type SimplifiedMessage = {
  roomId: number;
  userName: string;
  message: string;
};
