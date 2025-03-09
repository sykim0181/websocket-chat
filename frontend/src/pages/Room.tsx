import { Link, useParams } from "react-router";
import { Button, Input, Snackbar } from "@mui/material";
import { useRef } from "react";

import useChatRoom from "../hooks/useChatRoom";

const Room = () => {
  const { roomId } = useParams();

  if (roomId === undefined) {
    throw new Error("유효하지 않는 방");
  }

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { 
    room,
    messages,
    sendMessage,
    errorMsg
  } = useChatRoom({ roomId: Number(roomId) });

  const onClickSendButton = () => {
    if (!inputRef.current || inputRef.current.value === "") {
      return;
    }

    const message = inputRef.current.value;
    sendMessage(message);
  }

  return (
    <main>
      <Button>
        <Link to="/rooms">뒤로가기</Link>
      </Button>
      <h1>{room?.name}</h1>

      <ul>
        {messages.map((message, idx) => (
          <li key={`msg-${idx}`}>
            <p>{message.userName}</p>
            <p>{message.message}</p>
          </li>
        ))}
      </ul>

      <div>
        <Input inputRef={inputRef} />
        <Button onClick={onClickSendButton}>전송</Button>
      </div>

      <Snackbar open={errorMsg !== null} message={errorMsg} autoHideDuration={5000} />
    </main>
  );
};

export default Room;
