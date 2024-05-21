import React, { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { baseBackendUrl } from "../constant";
import LoginContext from "./AuthContext";
import MessageContext from "./MessageContext";
import OnlineUserContext from "./OnlineUserContext";
const BACKURL = baseBackendUrl.replace("api/v1", "");
import axios from "axios";
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
  const [oUser, setOUser] = useState({});

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
        console.log("onlineUsers id", loginCtx.userid, onlineUsers);
        console.log("user", loginCtx.name);
        setOUser(onlineUsers);
      });

      socket.on("getmessage", (data) => {
        if (data?.message?.from === data.message.to) return;
        updateMessageStatusHandler(data?.message?._id, "delivered");
        console.log("message Socket", data?.message);

        msgCtx.setNewMessages(data?.message, 0, 0);
      });

      socket.on("getupdatestatus", (message) => {
        console.log("message status updated status", message);
        msgCtx.setNewMessages(message, 1, 1);
      });

      socket.on("hello", () => {
        console.log("Received 'hello' event from server");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (msgCtx.msgToSocket === null) return;
    const newSocket = socket;
    if (newSocket === null) return;
    const msg = msgCtx.msgToSocket;
    console.log("ouser send", oUser);
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
    const { onlineUsers } = onlineUserCtx;
    const { userid } = loginCtx;
    const {
      onlineUsers: onlineUsersData,
      onlineUsersSocket: onlineUsersSocketData,
    } = oUser || {};

    if (
      !onlineUsersData ||
      !Array.isArray(onlineUsersData) ||
      onlineUsersData.length === 0 ||
      !onlineUsersSocketData ||
      !Array.isArray(onlineUsersSocketData) ||
      onlineUsersSocketData.length !== onlineUsersData.length ||
      onlineUsers.length === 0
    ) {
      return; // Exit early if oUser data is invalid or incomplete
    }

    const updatedUsers = onlineUsers.map((user) => {
      const idx = onlineUsersData.findIndex((u) => u === user._id);
      const online = idx !== -1; // Determine if user is online based on index found

      return {
        ...user,
        online,
        socketId: online ? onlineUsersSocketData[idx] : null,
        name: user._id === userid ? "  You" : user.name,
      };
    });

    onlineUserCtx.setOnlineUsers(updatedUsers); // Update onlineUsersCtx with updatedUsers
  };

  const updateMessageStatusHandler = async (msgId, status) => {
    if (!msgId) return;
    try {
      const resp = await axios.patch(
        `${baseBackendUrl}/message/status/${msgId}`,
        { status: status }
      );
      const messageData = resp?.data?.data;
      if (messageData === null || messageData === undefined || !messageData) {
        return console.log("Message data not found:");
      }
      console.log("Message status updated", messageData);

      msgCtx.setNewMessages(messageData, 1, 0);
      socket.emit("updatestatus", {
        message: messageData,
        userId: messageData.from,
      });
    } catch (error) {
      console.log("Error updating message status:", error, error?.message);
    }
  };

  const contextValue = {
    socket: socket,
    setSocketId: setSocket,
    updateMessageStatusHandler: updateMessageStatusHandler,
  };
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
