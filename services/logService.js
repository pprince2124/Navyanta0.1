// src/services/logService.js
import { NotificationLog } from "../models/notificationLogModel.js";

/**
 * Save a notification log entry
 * @param {Object} params
 * @param {String} params.userId - MongoDB ObjectId of the user
 * @param {String} params.channel - SMS | WhatsApp | Email
 * @param {String} params.event - Lifecycle event (OTP, QUOTATION_READY, etc.)
 * @param {Object} params.payload - Message metadata
 * @param {String} [params.providerMessageId] - ID returned by provider
 * @param {String} [params.status] - SENT | DELIVERED | FAILED
 * @param {Number} [params.appliedCostInr] - Approximate cost
 * @param {String} [params.error] - Error message if failed
 */
export const createNotificationLog = async ({
  userId,
  channel,
  event,
  payload = {},
  providerMessageId = null,
  status = "SENT",
  appliedCostInr = 0,
  error = null,
}) => {
  try {
    const log = new NotificationLog({
      userId,
      channel,
      event,
      payload,
      providerMessageId,
      status,
      appliedCostInr,
      error,
    });

    await log.save();
    return { success: true, log };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Fetch logs by filters (for admin dashboard)
 * @param {Object} filters - e.g. { channel: "SMS", event: "OTP" }
 */
export const getNotificationLogs = async (filters = {}) => {
  try {
    const logs = await NotificationLog.find(filters).sort({ createdAt: -1 });
    return { success: true, logs };
  } catch (err) {
    return { success: false, error: err.message };
  }
};