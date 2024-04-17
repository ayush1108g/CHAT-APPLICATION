const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
router
  .route("/:userid")
  .get(messageController.getMessage)
  .post(messageController.postMessage)
  .delete(messageController.deleteMessage);

module.exports = router;
