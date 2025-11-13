import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Project from "../models/projectModel.js";
import Service from "../models/serviceModel.js";


// ---------------- ADMIN LOGIN ----------------
export const loginAdmin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.loginCount += 1;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DASHBOARD STATS ----------------
export const adminDashboard = async (req, res) => {
  try {
    const [userCount, serviceCount, projectCount, completedCount, cancelledCount] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Service.countDocuments(),
        Project.countDocuments(),
        Project.countDocuments({ status: "completed" }),
        Project.countDocuments({ status: "cancelled" }),
      ]);

    res.status(200).json({
      users: userCount,
      services: serviceCount,
      projects: projectCount,
      completedProjects: completedCount,
      cancelledProjects: cancelledCount,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- FETCH PROJECTS ----------------
export const projectsAdmin = async (req, res) => {
  try {
    const { status, serviceId, customerId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (serviceId) query.serviceRef = serviceId;
    if (customerId) query.customerRef = customerId;

    const projects = await Project.find(query)
      .populate("customerRef", "name email mobile image")   // include image
      .populate("serviceRef", "name categoryRef")           // include service name
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
    });
  }
};
// ---------------- CANCEL PROJECT ----------------
export const projectCancel = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }

    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.status === "completed") {
      return res.status(400).json({ success: false, message: "Cannot cancel a completed project" });
    }

    project.status = "cancelled";
    project.cancellationReason = reason || "Cancelled by admin";
    project.lastUpdatedBy = adminId;
    await project.save();

    res.status(200).json({ success: true, message: "Project cancelled", project });
  } catch (err) {
    console.error("Cancel project error:", err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
    });
  }
};

// ---------------- COMPLETE PROJECT ----------------
export const projectComplete = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }

    const { id } = req.params;
    const adminId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cannot complete a cancelled project" });
    }
    if (project.status === "completed") {
      return res.status(400).json({ success: false, message: "Project already completed" });
    }

    project.status = "completed";
    project.lastUpdatedBy = adminId;
    project.completedAt = new Date();
    await project.save();

    res.status(200).json({ success: true, message: "Project marked as completed", project });
  } catch (err) {
    console.error("Complete project error:", err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production" ? "Server error" : err.message,
    });
  }
};



// Approve visit
export const approveVisit = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.visitApproved = true;
    project.lastUpdatedBy = req.user?.id || null;
    project.lastUpdatedAt = new Date();

    await project.save();

    res.json({ success: true, message: "Visit approved", project });
  } catch (error) {
    console.error("Approve visit error:", error);
    res.status(500).json({ success: false, message: "Server error during visit approval" });
  }
};

// Share quotation (upload PDF file)
export const shareQuotationFile = async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Save file path
    const quotationPath = `/uploads/quotations/${file.filename}`;
    project.quotationFile = quotationPath;

    // Mark quotation as shared
    project.status = "quotation_shared";
    project.lastUpdatedBy = req.user?.id || null;
    project.lastUpdatedAt = new Date();

    await project.save();

    res.status(200).json({
      success: true,
      message: "Quotation shared successfully",
      file: quotationPath,
      projectId: project._id,
    });
  } catch (error) {
    console.error("Share quotation file error:", error);
    res.status(500).json({ success: false, message: "Server error during quotation sharing" });
  }
};


// Confirm payment and update project status

export const confirmPayment = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Mark payment as accepted
    project.advancePaid = true;
    project.status = "advance_paid"; // ✅ new status
    project.lastUpdatedBy = req.user?.id || null;
    project.lastUpdatedAt = new Date();

    await project.save();

    // Optionally trigger notification/email to user
    res.json({
      success: true,
      message: "Payment confirmed. Materials will be assembled as per quotation.",
      project,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ---------------- CONFIRM FINAL PAYMENT ----------------
export const confirmFinalPayment = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.paymentCompleted = true;
    project.status = "completed";   // ✅ mark project as completed
    project.lastUpdatedBy = req.user?.id || null;
    project.lastUpdatedAt = new Date();

    await project.save();

    res.json({
      success: true,
      message: "Final payment confirmed. Project marked as completed.",
      project,
    });
  } catch (error) {
    console.error("Confirm final payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};