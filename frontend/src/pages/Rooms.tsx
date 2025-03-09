import { Box, Button, InputLabel, Modal, Snackbar, SxProps, TextField, Theme } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

import RoomManager from "../libs/RoomManager";

const modalBoxStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  border: '1px solid black',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column'
};

const Rooms = () => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['all-rooms'], 
    queryFn: async () => {
      const rooms = await RoomManager.getRooms()
      return rooms;
    },
    staleTime: 1000 * 60,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RoomList = () => {
    if (data === undefined) {
      return (
        <p>가져오는 중...</p>
      );
    }

    if (data.length === 0) {
      return (
        <p>없음</p>
      );
    }

    return (
      <ul>
        {data.map((room, idx) => (
          <li key={`room-${idx}`}>
            <Link to={`/room/${room.id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main>
      <h1>현재 방 목록</h1>

      <Button onClick={handleOpen}>새로 만들기</Button>

      <Modal open={open} onClose={handleClose}>
        <CreateRoomModal />
      </Modal>
      
      <RoomList />
    </main>
  );
};

export default Rooms;

const CreateRoomModal = () => {
  const [roomName, setRoomName] = useState("");
  const [isRoomNameError, setIsRoomNameError] = useState(true);
  const [roomNameHelperText, setRoomNameHelperText] = useState("");

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, error } = useMutation({
    mutationFn: async (roomName: string) => {
      const roomId = await RoomManager.createRoom(roomName);
      return roomId;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-rooms'] });
      navigate(`/room/${data}`);
    }
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isRoomNameError) {
      return;
    }

    try {
      mutate(roomName);
    } catch(error) {
      console.log("방 생성 중 오류:", error);
      return;
    }
  }

  const onChangeRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setRoomName(name);

    // TODO: 중복되는 방 이름 존재하는 경우 예외 처리
    if (name.length < 1) {
      setIsRoomNameError(true);
      setRoomNameHelperText("1자 이상 입력해주세요.")
    } else {
      setIsRoomNameError(false);
    }
  }

  return (
    <>
      <Box 
        component="form" 
        onSubmit={onSubmit}
        sx={modalBoxStyle}
      >
        <InputLabel htmlFor="room-name">방 이름</InputLabel>
        <TextField 
          id="room-name"
          value={roomName}
          onChange={onChangeRoomName}
          error={isRoomNameError}
          helperText={roomNameHelperText}
        />
        <Button type="submit">생성하기</Button>
      </Box>

      <Snackbar open={error !== null} message="방 생성 실패" />
    </>
  );
}
