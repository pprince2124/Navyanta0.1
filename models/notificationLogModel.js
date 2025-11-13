// src/models/notificationLogModel.js
import mongoose from "mongoose";

const notificationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channel: {
      type: String,
      enum: ["SMS", "WhatsApp", "Email"],
      required: true,
    },
    event: {
      type: String,
      required: true, // e.g., OTP, QUOTATION_READY, PROJECT_COMPLETED
    },
    payload: {
      type: Object,
      default: {},
    },
    providerMessageId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "FAILED"],
      default: "SENT",
    },
    appliedCostInr: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const NotificationLog = mongoose.model(
  "NotificationLog",
  notificationLogSchema
);