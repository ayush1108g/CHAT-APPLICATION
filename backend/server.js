const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { Server } = require("socket.io");
const { createServer } = require("http");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;

const onlineUsers = new Map(); // Store online users using a Map

io.on("connection", (socket) => {
  console.log("new connection");
  console.log(socket.id);

  socket.on("join", (userid) => {
    console.log("joined", userid);
    onlineUsers.set(userid, socket.id);
    console.log(onlineUsers);
    const onlineUsersList = Array.from(onlineUsers.keys());
    const onlineUsersSocket = Array.from(onlineUsers.values());

    io.emit("online", {
      onlineUsers: onlineUsersList,
      onlineUsersSocket: onlineUsersSocket,
    });
  });

  socket.on("sendmessage", (data) => {
    const socketId = data.socketId;
    const message = data.message;
    console.log("message", message);
    io.to(socketId).emit("getmessage", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log(onlineUsers);
    const onlineUsersList = Array.from(onlineUsers.keys());
    const onlineUsersSocket = Array.from(onlineUsers.values());

    io.emit("online", {
      // Emit event to all connected clients
      onlineUsers: onlineUsersList,
      onlineUsersSocket: onlineUsersSocket,
    });
  });
});

server.listen(port, () => {
  console.log(`Node is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
