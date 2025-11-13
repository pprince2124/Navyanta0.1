// src/services/adapters/whatsappAdapter.js
import axios from "axios";
import { notifyConfig } from "../../config/notifyConfig.js";

export const sendWhatsApp = async ({ phone, message, media }) => {
  const { apiKey, source } = notifyConfig.whatsapp;

  try {
    const payload = {
      channel: "whatsapp",
      source,
      destination: phone,
      message,
      "src.name": "NAVYANTA",
    };

    if (media) {
      payload.media = {
        type: "file",
        url: media.url,
        caption: media.caption,
      };
    }

    const { data } = await axios.post(
      "https://api.gupshup.io/sm/api/v1/msg",
      payload,
      {
        headers: { apikey: apiKey, "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return {
      success: true,
      providerMessageId: data?.messageId,
      appliedCostInr: 0.35,
    };
  } catch (err) {
    return { success: false, error: err?.response?.data || err.message };
  }
};