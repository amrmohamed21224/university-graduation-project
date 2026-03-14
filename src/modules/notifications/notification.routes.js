const express = require("express");
const router = express.Router();
const notificationController = require("./notification.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.get("/", authMiddleware, notificationController.getNotifications);
router.put("/:id/read", authMiddleware, notificationController.markNotificationAsRead);

module.exports = router;
