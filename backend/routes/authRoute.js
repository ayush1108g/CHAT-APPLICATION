const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/").get(authController.protect, authController.verifyToken);

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgotpassword").post(authController.forgotPassword);
// router.route("/verifycode").post(authController.verifycode);
router.route("/resetpassword/:token").patch(authController.resetPassword);

router
  .route("/updateexpotoken")
  .post(authController.protect, authController.updateExpoToken);
router.route("/getuser/:id").get(authController.getUser);
router.route("/getallusers/:id").get(authController.getAllUsers);

module.exports = router;
