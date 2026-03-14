const Notification = require("./notification.model");
const sendEmail = require("../../utils/email.util");
exports.createAndSendNotification = async ({
  user,
  document,
  type,
}) => {
  try {
    const existing = await Notification.findOne({
      userId: user._id,
      documentId: document._id,
      type,
    });

    if (existing) {
      return null; 
    }
    const notification = await Notification.create({
      userId: user._id,
      documentId: document._id,
      type,
    });
    const subject =
      type === "renewal"
        ? "Document Expiring Soon"
        : "Document Expired";
    await sendEmail(
      user.email,
      subject,
      `Your document "${document.name}" requires attention.`
    );
    notification.status = "sent";
    await notification.save();

    return notification;
  } catch (error) {
    console.error("Notification Error:", error.message);
    if (error.code !== 11000) {
      // 11000 = duplicate key error
      await Notification.updateOne(
        { userId: user._id, documentId: document._id, type },
        { status: "failed" }
      );
    }

    return null;
  }
};
exports.getUserNotifications = async (userId) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 });
};
exports.markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};