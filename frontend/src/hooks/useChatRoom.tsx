import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import ChatManager from "../libs/ChatManager";
import { SimplifiedMessage } from "../types";
import RoomManager from "../libs/RoomManager";
import { useUserContext } from "../context/UserContext";
import { simplifyMessage } from "../utils";

interface useChatRoomProps {
  roomId: number;
}

const useChatRoom = (props: useChatRoomProps) => {
  const { roomId } = props;

  const [messages, setMessages] = useState<SimplifiedMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatManager = useRef<ChatManager | null>(null);

  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user, navigate]);

  const { data, error } = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const room = await RoomManager.getRoom(roomId);
      return room;
    },
  });

  useEffect(() => {
    if (error) {
      setErrorMsg(error.message);
    }
  }, [error]);

  useEffect(() => {
    chatManager.current = new ChatManager(roomId);
    chatManager.current.setOnMessageEventHandler((message) => {
      setMessages(prev => [...prev, message]);
    });

    // 기존의 메시지
    RoomManager.getRoomMessage(roomId)
      .then(messages => {
        setMessages(messages.map(msg => simplifyMessage(msg)));
      })
      .catch(error => {
        setErrorMsg(error.message);
      });

    return () => {
      chatManager.current?.leaveRoom();
      chatManager.current = null;
      setMessages([]);
    }
  }, [roomId]);

  const sendMessage = (message: string) => {
    if (!chatManager.current || user === null) {
      setErrorMsg('메시지를 보낼 수 없습니다.');
      return;
    }
    
    try {
      chatManager.current.sendMessage(user.userName, message);
      const simplifiedMessage: SimplifiedMessage = {
        roomId,
        userName: user.userName,
        message
      };
      setMessages(prev => [...prev, simplifiedMessage]);
    } catch(error) {
      console.log(error);
      setErrorMsg('메시지를 보낼 수 없습니다.');
    }
  };

  return {
    room: data,
    messages,
    sendMessage,
    errorMsg
  };
};

export default useChatRoom;
