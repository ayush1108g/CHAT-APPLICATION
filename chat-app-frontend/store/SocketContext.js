import React, { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { baseBackendUrl } from "../constant";
import LoginContext from "./AuthContext";
import MessageContext from "./MessageContext";
import OnlineUserContext from "./OnlineUserContext";
const BACKURL = baseBackendUrl.replace("api/v1", "");
import AsyncStorage from "@react-native-async-storage/async-storage";

const SocketContext = createContext({
  socket: null,
  setSocketId: () => {},
});

export const SocketContextProvider = ({ children }) => {
  const loginCtx = useContext(LoginContext);
  const msgCtx = useContext(MessageContext);
  const onlineUserCtx = useContext(OnlineUserContext);
  const [socket, setSocket] = useState(null);
  const [oUser, setOUser] = useState([]);

  useEffect(() => {
    const newSocket = io(BACKURL, {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [loginCtx.isLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.emit("join", loginCtx.userid);
      socket.on("online", (onlineUsers) => {
        console.log("onlineUsers", onlineUsers);
        console.log("user", loginCtx.name);
        setOUser(onlineUsers);
      });

      socket.on("getmessage", (message) => {
        console.log("message", message);
        msgCtx.setNewMessages(message);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (msgCtx.msgToSocket === null) return;
    const newSocket = socket;
    if (newSocket === null) return;
    const msg = msgCtx.msgToSocket;
    const idx = oUser.onlineUsers.findIndex((user) => user === msg.to);

    if (idx !== -1) {
      const socketId = oUser.onlineUsersSocket[idx];
      newSocket.emit("sendmessage", {
        message: msg,
        socketId: socketId,
      });
    }
    msgCtx.setMsgToSocket(null);
  }, [msgCtx.msgToSocket]);

  useEffect(() => {
    setOnlineUsers();
  }, [oUser]);

  const setOnlineUsers = () => {
    const OnlineUsers = oUser;
    if (OnlineUsers.length === 0) {
      return;
    }
    if (onlineUserCtx.onlineUsers.length === 0) {
      return;
    }

    const data = [...onlineUserCtx.onlineUsers];

    data.forEach((user) => {
      const idx = OnlineUsers.onlineUsers.findIndex((u) => u === user._id);
      user.online = false;
      if (idx !== -1) {
        user.online = true;
        user.socketId = OnlineUsers.onlineUsersSocket[idx];
      }
      if (user._id === loginCtx.userid) {
        user.name = "  You";
        data.unshift(data.splice(data.indexOf(user), 1)[0]);
      }
      return user;
    });

    onlineUserCtx.setOnlineUsers(data);
  };

  const contextValue = {
    socket: socket,
    setSocketId: setSocket,
  };
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
