import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import ensureAdminExists from "./config/ensureAdminExists.js";

// Routers
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import notifyRouter from "./routes/notifyRouter.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"] , // React dev server
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// JSON parser
app.use(express.json());

// Static uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- ROUTES ----------------
app.use("/api/notify", notifyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/service", serviceRouter);
app.use("/api/category", categoryRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ---------------- START SERVER ----------------
const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminExists();
    connectCloudinary();

    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();