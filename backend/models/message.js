const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "From is required"],
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "To is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "text",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  replyto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  // reaction: {
  //   type: String,
  //   default: "like",
  // },
});

// messageSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "ref",
//     select: "name photo",
//   });
//   next();
// });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
