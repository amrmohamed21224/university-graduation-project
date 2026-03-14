const notificationService = require("./notification.service");
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications =
      await notificationService.getUserNotifications(req.user.id);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const updated =
      await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};