// src/config/notifyConfig.js
import dotenv from "dotenv";

dotenv.config();

export const notifyConfig = {
  sms: {
    provider: "MSG91",
    authKey: process.env.MSG91_AUTH_KEY,
    senderId: process.env.MSG91_SENDER_ID,
    route: process.env.MSG91_ROUTE || "4", // transactional
    country: process.env.MSG91_COUNTRY || "91",
  },
  whatsapp: {
    provider: "Gupshup",
    apiKey: process.env.GUPSHUP_API_KEY,
    source: process.env.GUPSHUP_SOURCE,
  },
  email: {
    provider: "AWS_SES",
    region: process.env.AWS_REGION || "ap-south-1",
    sender: process.env.SES_EMAIL,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  defaults: {
    countryCode: process.env.NOTIFY_DEFAULT_COUNTRY_CODE || "+91",
  },
};