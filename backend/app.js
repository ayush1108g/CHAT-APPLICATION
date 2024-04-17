const express = require("express");

const app = express();
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authRouter = require("./routes/authRoute");
const messageRouter = require("./routes/messageRoute");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the backend!",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
