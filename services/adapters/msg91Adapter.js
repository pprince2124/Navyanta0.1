// src/services/adapters/msg91Adapter.js
import axios from "axios";
import { notifyConfig } from "../../config/notifyConfig.js";

export const sendSMS = async ({ phone, message }) => {
  const { authKey, senderId, route, country } = notifyConfig.sms;

  try {
    const payload = {
      sender: senderId,
      route,
      country,
      sms: [{ message, to: [phone] }],
    };

    const { data } = await axios.post("https://api.msg91.com/api/v5/sms", payload, {
      headers: { authkey: authKey, "Content-Type": "application/json" },
    });

    return {
      success: true,
      providerMessageId: data?.messages?.[0]?.message,
      appliedCostInr: 0.15,
    };
  } catch (err) {
    return { success: false, error: err?.response?.data || err.message };
  }
};