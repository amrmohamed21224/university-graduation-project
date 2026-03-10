const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    type: {
      type: String,
      enum: ["renewal", "expired"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    alertDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
notificationSchema.index(
  { userId: 1, documentId: 1, type: 1 },
  { unique: true }
);

module.exports = mongoose.model("Notification", notificationSchema);