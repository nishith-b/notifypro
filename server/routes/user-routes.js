const express = require("express");
const { UserController } = require("../controllers");

const router = express.Router();

router.post("/signup", UserController.handleSignup);

module.exports = router;
