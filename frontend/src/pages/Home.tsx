import { Box, Button, InputLabel, Snackbar, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { useUserContext } from "../context/UserContext";

const Home = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { setUser } = useUserContext();

  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usernameRef.current) {
      return;
    }

    const userName = usernameRef.current.value;
    console.log(userName);
    if (userName === "" || userName === undefined) {
      setErrorMsg("닉네임을 입력해주세요.");
      return;
    }

    setUser({ userName });
    navigate("/rooms");
  }

  return (
    <main>
      <Box 
        component="form" 
        onSubmit={onSubmit} 
        sx={{
          display: "flex", 
          flexDirection: "column" 
        }}
      >
        <InputLabel htmlFor="user-name">닉네임</InputLabel>
        <TextField 
          id="user-name" 
          inputRef={usernameRef}
        />
        <Button 
          type="submit" 
          variant="contained"
          style={{
            marginTop: "1rem"
          }}
        >채팅 시작하기</Button>
      </Box>

      <Snackbar open={errorMsg !== null} message={errorMsg} autoHideDuration={5000} />
    </main>
  );
};

export default Home;
