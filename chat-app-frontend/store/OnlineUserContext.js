import React, { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";
import { baseBackendUrl } from "../constant";
import LoginContext from "./AuthContext";
const OnlineUserContext = createContext({
  onlineUsers: [],
  clear: () => {},
  refresh: () => {},
  setOnlineUsers: () => {},
});

export const OnlineUserContextProvider = ({ children }) => {
  const loginCtx = useContext(LoginContext);
  const [intervalId, setIntervalId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const userid = loginCtx.userid;

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${baseBackendUrl}/auth/getallusers/${userid}`
      );
      const data = [...response.data.data];

      setOnlineUsers(data);
      // const currentTime = Date.now();
      // const onlineUsers = [];
      // const offlineUsers = [];

      // console.log("data", data.length);
      // data.forEach((user) => {
      //   if (user._id === userid) {
      //     user.name = "  You";
      //     onlineUsers.push(user);
      //     return;
      //   }
      //   if (
      //     new Date(user.lastonline).getTime() >= new Date(currentTime).getTime()
      //   ) {
      //     onlineUsers.push(user);
      //   } else {
      //     offlineUsers.push({ ...user, lastonline: false });
      //   }
      // });
      // console.log("online", onlineUsers);

      // setOnlineUsers(Array.from(new Set(onlineUsers.concat(offlineUsers))));
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (loginCtx.isLoggedIn) {
      // const intervalId = setInterval(() => {
      console.log(loginCtx.name);
      getAllUsers();
      // }, 1000 * 45);
      // setIntervalId(intervalId);
    }
  }, [loginCtx.isLoggedIn]);

  const clear = () => {
    clearInterval(intervalId);
  };

  const contextValue = {
    onlineUsers,
    refresh: getAllUsers,
    clear: clear,
    setOnlineUsers: setOnlineUsers,
  };
  return (
    <OnlineUserContext.Provider value={contextValue}>
      {children}
    </OnlineUserContext.Provider>
  );
};

export default OnlineUserContext;
