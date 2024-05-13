const Message = require("../models/message");
const User = require("../models/user");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

// const deleteMessage = async () => {
//   const AllMessages = await Message.find();

//   AllMessages.map(async (message) => {
//     const from = await User.findById(message.from);
//     const to = await User.findById(message.to);
//     if (!from || !to) {
//       await Message.findByIdAndDelete(message._id);
//       console.log("Deleted");
//     }
//   });
//   return null;
// };
// deleteMessage();

const sendPushNotification = async (expoPushToken, title, body, data) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title || "Original Title",
    body: body || "And here is the body!",
    data: data || { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send?useFcmV1=true", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

exports.getMessage = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const user = await User.findById(userid);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  const messages1 = await Message.find({ to: userid });
  const messages2 = await Message.find({ from: userid });
  const messages = messages1.concat(messages2);
  const msg = Array.from(new Set(messages));
  const message = msg.sort((a, b) => b.timeStamp - a.timeStamp);
  console.log(message, "message", message.length);
  res.status(200).json({
    status: "success",
    data: message,
  });
});

exports.postMessage = catchAsync(async (req, res, next) => {
  const { userid } = req.params;
  const from = userid;
  const { to, message, replyto } = req.body;
  const UserFrom = await User.findById(from);
  const UserTo = await User.findById(to);

  UserTo?.expoToken.map((token) => {
    return sendPushNotification(
      token,
      "New Message from " + UserFrom.name,
      message,
      { from: UserFrom.name }
    );
  });

  if (!UserFrom) {
    return next(new AppError("User from not found", 404));
  }
  if (!UserTo) {
    return next(new AppError("User to not found", 404));
  }
  //   if (userid === to) {
  //     return next(new AppError("You can't send message to yourself", 400));
  //   }
  const newMessage = await Message.create({
    from,
    to,
    message,
    replyto,
  });
  console.log(newMessage);
  res.status(201).json({
    status: "success",
    data: newMessage,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  return next(new AppError("This route is not yet defined", 500));
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { messageid } = req.params;
  const { status } = req.body;
  const message = await Message.findById(messageid);
  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  message.status = status;
  await message.save();
  console.log("mai msg controller me hu ", message);
  res.status(200).json({
    status: "success",
    data: message,
  });
});
