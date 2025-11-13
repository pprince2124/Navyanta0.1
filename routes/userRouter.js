import express from "express";
import {
  // Auth
  loginUser,
  registerUser,

  // Profile
  getProfile,
  updateProfile,

  // Projects
  bookProject,
  listProjects,
  cancelProject,
  acceptQuotation,
  completeProject, // final completion (if you want user to trigger)
} from "../controllers/userController.js";

import upload from "../middleware/multer.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

// ---------------- AUTH ----------------
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// ---------------- PROFILE ----------------
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, upload.single("image"), updateProfile);

// ---------------- PROJECTS ----------------
userRouter.post("/projects/book", authUser, bookProject);
userRouter.get("/projects", authUser, listProjects);
userRouter.post("/projects/cancel", authUser, cancelProject);

// ---------------- QUOTATION FLOW ----------------
userRouter.post("/projects/accept-quotation", authUser, acceptQuotation);

// ---------------- PAYMENTS ----------------
// ❌ Removed payAdvance (handled manually via UPI + admin confirmation)
// ✅ Keep completeProject if you want user to trigger final completion
userRouter.post("/projects/complete", authUser, completeProject);

export default userRouter;