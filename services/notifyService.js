// src/services/notifyService.js
import { sendSMS } from "./adapters/msg91Adapter.js";
import { sendWhatsApp } from "./adapters/whatsappAdapter.js";
import { sendEmail } from "./adapters/emailAdapter.js";
import { createNotificationLog } from "./logService.js";

/**
 * Unified notification service
 * Routes events to SMS (primary), WhatsApp (secondary), Email (tertiary)
 * Automatically logs every send in NotificationLog
 */
export const notifyUser = async ({ user, event, payload }) => {
  const phone = user.phone;
  const email = user.email;
  let result;

  try {
    switch (event) {
      case "OTP":
        result = await sendSMS({
          phone,
          message: `NAVYANTA OTP: ${payload.otp}`,
        });
        await createNotificationLog({
          userId: user._id,
          channel: "SMS",
          event,
          payload,
          providerMessageId: result.providerMessageId,
          status: result.success ? "SENT" : "FAILED",
          appliedCostInr: result.appliedCostInr,
          error: result.error || null,
        });
        return result;

      case "VISIT_APPROVED":
        result = await sendSMS({
          phone,
          message: `NAVYANTA: Your visit has been approved for ${payload.date}, ${payload.time}.`,
        });
        await createNotificationLog({
          userId: user._id,
          channel: "SMS",
          event,
          payload,
          providerMessageId: result.providerMessageId,
          status: result.success ? "SENT" : "FAILED",
          appliedCostInr: result.appliedCostInr,
          error: result.error || null,
        });
        return result;

      case "QUOTATION_READY":
        // WhatsApp + Email
        const waResult = await sendWhatsApp({
          phone,
          message: `Your quotation is ready. Ref: ${payload.refId}`,
          media: { url: payload.pdfUrl, caption: "Quotation PDF" },
        });
        await createNotificationLog({
          userId: user._id,
          channel: "WhatsApp",
          event,
          payload,
          providerMessageId: waResult.providerMessageId,
          status: waResult.success ? "SENT" : "FAILED",
          appliedCostInr: waResult.appliedCostInr,
          error: waResult.error || null,
        });

        const emailResult = await sendEmail({
          to: email,
          subject: "NAVYANTA Quotation",
          html: `<p>Your quotation is ready. Ref: ${payload.refId}</p>`,
          attachments: [{ filename: "quotation.pdf", path: payload.pdfPath }],
        });
        await createNotificationLog({
          userId: user._id,
          channel: "Email",
          event,
          payload,
          providerMessageId: emailResult.providerMessageId,
          status: emailResult.success ? "SENT" : "FAILED",
          appliedCostInr: emailResult.appliedCostInr,
          error: emailResult.error || null,
        });

        return { waResult, emailResult };

      case "PROJECT_COMPLETED":
        const waCompResult = await sendWhatsApp({
          phone,
          message: `Your project ${payload.projectName} is complete 🎉`,
          media: { url: payload.galleryUrl, caption: "See highlights" },
        });
        await createNotificationLog({
          userId: user._id,
          channel: "WhatsApp",
          event,
          payload,
          providerMessageId: waCompResult.providerMessageId,
          status: waCompResult.success ? "SENT" : "FAILED",
          appliedCostInr: waCompResult.appliedCostInr,
          error: waCompResult.error || null,
        });

        const emailCompResult = await sendEmail({
          to: email,
          subject: "NAVYANTA Project Completion",
          html: `<p>Your project ${payload.projectName} is complete. Warranty card attached.</p>`,
          attachments: [{ filename: "warranty.pdf", path: payload.warrantyPath }],
        });
        await createNotificationLog({
          userId: user._id,
          channel: "Email",
          event,
          payload,
          providerMessageId: emailCompResult.providerMessageId,
          status: emailCompResult.success ? "SENT" : "FAILED",
          appliedCostInr: emailCompResult.appliedCostInr,
          error: emailCompResult.error || null,
        });

        return { waCompResult, emailCompResult };

      default:
        return { success: false, error: "Unknown event type" };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};