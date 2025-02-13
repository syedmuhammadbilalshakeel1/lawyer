import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    caseType: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    senderPhoneNum: {
      type: String,
      required: true,
    },
    caseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Active", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
