const express = require("express");
const userRoutes = require("./user-routes");
const notificationRoutes = require("./notification-routes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/notification", notificationRoutes);

module.exports = router;
