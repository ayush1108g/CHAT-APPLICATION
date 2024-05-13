const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
router
  .route("/:userid")
  .get(messageController.getMessage)
  .post(messageController.postMessage)
  .delete(messageController.deleteMessage);

router.route("/status/:messageid").patch(messageController.updateStatus);
module.exports = router;
