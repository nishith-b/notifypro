const express = require("express");
const { NotificationController } = require("../controllers");
const { authenticateUser } = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/save", authenticateUser, NotificationController.saveChanges);
router.post("/send", authenticateUser, NotificationController.sendNotification);

module.exports = router;
