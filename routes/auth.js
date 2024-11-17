const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/sign-up", authController.signup_get);
router.post("/sign-up", authController.signup_post);
router.get("/sign-in", authController.signin_get);
router.post("/sign-in", authController.signin_post);
router.get("/sign-out", authController.signout);

module.exports = router;
