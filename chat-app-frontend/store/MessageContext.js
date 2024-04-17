import React, { useState, useContext, createContext, useEffect } from "react";
import LoginContext from "./AuthContext";
import { baseBackendUrl } from "../constant";
import axios from "axios";
// import SoundPlay from "./Sound";
const MessageContext = createContext({
  messages: [],
  sendMessage: (message, toid) => {},
  getMessages: (id) => {},
  msgToSocket: null,
  setMsgToSocket: (msg) => {},
  setNewMessages: (message) => {},
  refreshMessages: () => {},
});

export const MessageContextProvider = ({ children }) => {
  const loginCtx = useContext(LoginContext);
  const [messages, setMessages] = useState([]);
  const [msgToSocket, setMsgToSocket] = useState(null);

  useEffect(() => {
    if (loginCtx.isLoggedIn) {
      getMessages(loginCtx.userid);
    }
  }, [loginCtx.isLoggedIn]);

  const sendMessage = async (message, toid) => {
    const userid = loginCtx.userid;
    let newMessages = [...messages];
    console.log(toid, message, userid);
    let idx = newMessages.findIndex((item) => item.id === toid);
    const messageObj = {
      from: userid,
      _id: Math.random() * 100 + new Date().getTime(),
      to: toid,
      message: message,
      timeStamp: new Date(),
    };
    if (idx !== -1) {
      newMessages[idx].messages.unshift(messageObj);
    }
    setMessages(newMessages);
    try {
      const response = await axios.post(`${baseBackendUrl}/message/${userid}`, {
        to: toid,
        message: message,
      });
      const newMessage = response.data.data;
      console.log("newMessage", newMessage);
      setMsgToSocket(newMessage);
      if (idx !== -1) {
        newMessages[idx].messages[0] = newMessage;
      } else {
        refreshMessages();
      }
      setMessages(newMessages);
    } catch (e) {
      console.log("Error sending message:", e);
    }
  };

  const setNewMessages = (newMessage) => {
    if (newMessage.length > 0) return;

    // SoundPlay();
    const idx = messages.findIndex((item) => item.id === newMessage.from);
    if (idx !== -1) {
      newMessage[idx].messages.unshift(newMessage);
    } else {
      refreshMessages();
    }
  };
  const getMessages = async (id) => {
    try {
      const messagesResponse = await axios.get(
        `${baseBackendUrl}/message/${id}`
      );
      //get all messages related to the user
      const newMessages = messagesResponse.data.data;

      //get all unique user_id and set their messages in object
      //like in uniqueIDs
      // [
      //  {
      //    id:userid,
      //    user:{
      //      _id:userid,
      //      email:useremail,
      //      name:username,
      //      image:userimage
      //  },
      //  messages: [
      //    {
      //      _id:messageid,
      //      from:userfrom,
      //      to:userto,
      //      message:message,
      //      timeStamp:time,
      //      deleted:delete //true,false
      //      read:read //true,false
      //     },
      //    ]
      //   },
      // ]
      const uniqueIDs = await Promise.all(
        Array.from(
          new Set(
            newMessages.map((message) =>
              message.from === id ? message.to : message.from
            )
          )
        ).map(async (uid) => {
          try {
            const userResponse = await axios.get(
              `${baseBackendUrl}/auth/getuser/${uid}`
            );
            const user = userResponse.data.data;

            // If the user is the logged in user, set their name to "You" instead of their actual name for clarity
            if (uid === loginCtx.userid) {
              user.name = `You (${user.name})`;
              const uniqueMessages = newMessages.filter(
                (message, index, self) =>
                  index === self.findIndex((m) => m._id === message._id) &&
                  message.from === uid &&
                  message.to === uid
              ); // Remove duplicate messages from the same user
              return { id: uid, user, messages: uniqueMessages };
            }

            const messages = newMessages.filter(
              (message) => message.from === uid || message.to === uid
            );
            return { id: uid, user, messages };
          } catch (error) {
            console.error(
              `Error fetching user info for user ID ${uid}:`,
              error,
              "msgCtx.js 184"
            );
            return { id: uid, user: null, messages: [] };
          }
        })
      );
      setMessages(uniqueIDs);
      console.log("uniqueIDs", uniqueIDs[0].messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const refreshMessages = () => {
    getMessages(loginCtx.userid);
  };

  const constextValue = {
    messages,
    sendMessage,
    getMessages,
    refreshMessages,
    setNewMessages,
    msgToSocket,
    setMsgToSocket,
  };

  return (
    <MessageContext.Provider value={constextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
