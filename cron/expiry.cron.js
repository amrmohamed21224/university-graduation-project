const cron = require("node-cron");

const Document = require("../modules/documents/document.model");
const notificationService = require("../modules/notifications/notification.service");
const calculateStatus = require("../utils/status.util");

cron.schedule("0 2 * * *", async () => {
  console.log("Running expiry check...");

  try {
    const documents = await Document.find().populate("userId");

    for (let doc of documents) {
      const status = calculateStatus(doc.expiryDate);

      if (!status) continue;

      await notificationService.createAndSendNotification({
        user: doc.userId,
        document: doc,
        type: status,
      });
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});