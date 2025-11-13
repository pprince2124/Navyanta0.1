// src/routes/notifyRouter.js
import express from "express";
import { getNotificationLogs } from "../services/logService.js";

const router = express.Router();

/**
 * GET /api/notify/logs
 * Query params:
 *   channel=SMS|WhatsApp|Email
 *   event=OTP|QUOTATION_READY|PROJECT_COMPLETED
 *   from=YYYY-MM-DD
 *   to=YYYY-MM-DD
 */
router.get("/logs", async (req, res) => {
  try {
    const { channel, event, from, to } = req.query;
    const filters = {};

    if (channel) filters.channel = channel;
    if (event) filters.event = event;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const { success, logs, error } = await getNotificationLogs(filters);

    if (!success) return res.status(500).json({ error });

    // Calculate monthly spend
    const totalCost = logs.reduce((sum, log) => sum + (log.appliedCostInr || 0), 0);

    res.json({
      count: logs.length,
      totalCostInr: totalCost.toFixed(2),
      logs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;