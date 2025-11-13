import express from "express";
import {
  loginAdmin,
  adminDashboard,
  projectsAdmin,
  projectCancel,
  projectComplete,
  approveVisit,
  shareQuotationFile,   // ✅ unified controller
  confirmPayment,        // ✅ new controller
  confirmFinalPayment
} from "../controllers/adminController.js";

import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// ---------------- ADMIN LOGIN ----------------
router.post("/login", loginAdmin);

// ---------------- DASHBOARD ----------------
router.get("/dashboard", authAdmin, adminDashboard);

// ---------------- PROJECTS ----------------
router.get("/projects", authAdmin, projectsAdmin);

// ---------------- CANCEL PROJECT ----------------
router.put("/project/:id/cancel", authAdmin, projectCancel);

// ---------------- COMPLETE PROJECT ----------------
router.put("/project/:id/complete", authAdmin, projectComplete);

// ---------------- QUOTATION FLOW ----------------
router.post("/projects/approve-visit", authAdmin, approveVisit);

// ✅ merged: upload file = share quotation
router.post(
  "/projects/share-quotation-file",
  authAdmin,
  upload.single("quotationFile"), // expects field name "quotationFile"
  shareQuotationFile
);

// ---------------- PAYMENT CONFIRMATION ----------------
router.post("/projects/confirm-payment", authAdmin, confirmPayment);
router.post("/projects/confirm-final-payment", authAdmin, confirmFinalPayment);

export default router;