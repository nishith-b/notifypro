const express = require("express");
const { UserController } = require("../controllers");

const router = express.Router();

router.post("/signup", UserController.handleSignup);
router.post("/login",UserController.handleLogin)

module.exports = router;
