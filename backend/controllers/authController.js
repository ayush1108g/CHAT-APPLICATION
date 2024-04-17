const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const email = require("../utils/nodemailer");
const { promisify } = require("util");
const { findByIdAndUpdate } = require("../models/message");

const signToken = (id) => {
  const token = jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  console.log(token);
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken({ id: user._id });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("you are not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id).select("+password");
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does not exist", 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! please login again", 401)
    );
  }
  req.user = currentUser;
  next();
});

const verifyToken = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    message: "you are logged in",
  });
});

const signup = catchAsync(async (req, res) => {
  console.log(req.body);
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const newUser = await User.create(newUserData);
  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }
  createSendToken(user, 200, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("there is no user with that email address", 404));

  const resetToken = await user.createpasswordresetpassword();
  await user.save();
  const code = resetToken;
  const message = `Your verification code is \n ${resetToken}\n If you didn't forget your password, please ignore this email!`;
  try {
    await email({
      email: user.email,
      subject: "Password Reset code",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "password reset link sent to your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordresetexpired = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError("there was an error sending the email. try again later", 500)
    );
  }
});
// const verifycode = catchAsync(async (req, res, next) => {
//   const hashtoken = req.body.code;
//   console.log(hashtoken);
//   const user = await User.findOne({
//     resetPasswordToken: hashtoken,
//     passwordresetexpired: { $gt: Date.now() },
//   });
//   if (!user) {
//     return next(new AppError("password reset code is invalid", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     message: "go to next page",
//   });
// });

const resetPassword = catchAsync(async (req, res, next) => {
  const hashtoken = req.params.token;
  console.log(hashtoken);
  const user = await User.findOne({
    resetPasswordToken: hashtoken,
    passwordresetexpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("password reset code is invalid", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.passwordresetexpired = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

const getUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  const data = {
    name: user.name,
    email: user.email,
    image: user.image,
    _id: user._id,
  };
  res.status(200).json({
    status: "success",
    data: data,
  });
});

// update last online time of user and get all users
const getAllUsers = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, {
    lastonline: Date.now() + 1000 * 60,
  });

  const Alluser = await User.find();
  const data = Alluser.map((user) => {
    return {
      name: user.name,
      email: user.email,
      image: user.image,
      _id: user._id,
      lastonline: user.lastonline,
    };
  });
  res.status(200).json({
    status: "success",
    data: data,
  });
});

const updateExpoToken = catchAsync(async (req, res) => {
  const token = req.body.token;
  const prevToken = req.user.expoToken;
  console.log(token, prevToken);
  if (prevToken?.findIndex((t) => t === token) === -1) {
    prevToken.push(token);
  } else {
    return res.status(200).json({
      status: "success",
      message: "Token already exists",
    });
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    expoToken: prevToken,
  });
  res.status(200).json({
    status: "success",
    data: user,
  });
});

module.exports = {
  signToken,
  createSendToken,
  protect,
  verifyToken,
  signup,
  login,
  forgotPassword,
  // verifycode,
  resetPassword,
  getUser,
  getAllUsers,
  updateExpoToken,
};
