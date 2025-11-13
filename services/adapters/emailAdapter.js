// src/services/adapters/emailAdapter.js
import AWS from "aws-sdk";
import { notifyConfig } from "../../config/notifyConfig.js";

const ses = new AWS.SES({
  region: notifyConfig.email.region,
  accessKeyId: notifyConfig.email.accessKey,
  secretAccessKey: notifyConfig.email.secretKey,
});

export const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const params = {
      Source: notifyConfig.email.sender,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: html } },
      },
    };

    const result = await ses.sendEmail(params).promise();

    return {
      success: true,
      providerMessageId: result.MessageId,
      appliedCostInr: 0.05, // SES cost per email
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};