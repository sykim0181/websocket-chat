import { useParams } from "react-router";
import { Box, Button, Input, Snackbar } from "@mui/material";
import { useLayoutEffect, useRef } from "react";

import useChatRoom from "../hooks/useChatRoom";
import { useUserContext } from "../context/UserContext";

const Room = () => {
  const { roomId } = useParams();

  if (roomId === undefined) {
    throw new Error("유효하지 않는 방");
  }

  const { user } = useUserContext();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { 
    room,
    messages,
    sendMessage,
    errorMsg
  } = useChatRoom({ roomId: Number(roomId) });

  useLayoutEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  const onClickSendButton = () => {
    if (!inputRef.current || inputRef.current.value === "") {
      return;
    }

    const message = inputRef.current.value;
    sendMessage(message);
  }

  return (
    <Box component="main">
      <Box 
        position="fixed" 
        width="100%" 
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        style={{
          backgroundColor: "white"
        }}
      >
        <Button href="/rooms" style={{
          height: "fit-content",
          flexShrink: 0
        }}>
          돌아가기
        </Button>

        <h1 style={{
          textAlign: 'center',
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }}>{room?.name}</h1>
      </Box>

      <Box 
        marginBottom="2rem"
        paddingTop="5rem"
        paddingBottom="4rem"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((message, idx) => {
          const isMyMsg = message.userName === user?.userName;

          return (
            <Box key={`msg-${idx}`} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMyMsg ? 'flex-end' : 'flex-start'
            }}>
              <p style={{
                fontSize: '0.8rem',
                margin: 0
              }}>{message.userName}</p>
              <p style={{
                backgroundColor: '#e2e2e2',
                borderRadius: '1rem',
                padding: '1rem',
              }}>{message.message}</p>
            </Box>
          );
        })}
      </Box>

      <Box 
        width="100%"
        boxSizing="border-box"
        display="flex"
        gap="1rem"
        position="fixed"
        bottom="0"
        padding="1rem"
        style={{
          backgroundColor: "white"
        }}
      >
        <Input inputRef={inputRef} style={{
          flexGrow: "1"
        }} />
        <Button onClick={onClickSendButton} variant="contained">전송</Button>
      </Box>

      <Snackbar open={errorMsg !== null} message={errorMsg} autoHideDuration={5000} />
    </Box>
  );
};

export default Room;
