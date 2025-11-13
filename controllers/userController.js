import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import Project from "../models/projectModel.js";
import { v2 as cloudinary } from "cloudinary";

// ---------------- REGISTER ----------------

// REGISTER (mobile only)
export const registerUser = async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ success: false, message: "Missing required details" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    if (await userModel.findOne({ mobile })) {
      return res.status(400).json({ success: false, message: "Mobile already registered" });
    }

    const passwordHash = await userModel.hashPassword(password);

    const user = new userModel({ name, mobile, passwordHash });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN (mobile only)
export const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await userModel.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "Mobile not registered" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.loginCount += 1;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- PROFILE ----------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId).select("-passwordHash");
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender, email } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (dob) updates.dob = dob;
    if (gender) updates.gender = gender;
    if (email) updates.email = email;

    if (address) {
      try {
        updates.address = typeof address === "string" ? JSON.parse(address) : address;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid address format" });
      }
    }

    if (req.file) {
      updates.image = `uploads/${req.file.filename}`;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- PROJECTS ----------------

// Book project
export const bookProject = async (req, res) => {
  try {
    const { serviceRef, projectDate, slotTime, directPurchase, address, contactNo } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const project = await Project.create({
      customerRef: req.user.id,
      serviceRef,
      projectDate,
      slotTime,
      address,
      contactNo,
      directPurchase: !!directPurchase,
      status: directPurchase ? "scheduled" : "requested",
    });

    res.status(201).json({ success: true, message: "Project request created", project });
  } catch (error) {
    console.error("Book project error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// List projects
export const listProjects = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const projects = await Project.find({ customerRef: req.user.id })
      .populate("serviceRef", "name categoryRef image")
      .populate("fabricatorRef", "name mobile")
      .select("serviceRef status quotation quotationFile quotationAccepted projectDate slotTime address contactNo paymentCompleted advancePaid cancellationReason")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (error) {
    console.error("List projects error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel project
export const cancelProject = async (req, res) => {
  try {
    const { projectId, reason } = req.body;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.customerRef.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    project.status = "cancelled";
    project.cancellationReason = reason || "Cancelled by customer";
    project.lastUpdatedBy = req.user.id;
    await project.save();

    res.json({ success: true, message: "Project cancelled", project });
  } catch (error) {
    console.error("Cancel project error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Accept quotation
export const acceptQuotation = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.customerRef.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    project.quotationAccepted = true;
    project.status = "quotation_accepted";
    await project.save();

    res.json({ success: true, message: "Quotation accepted", project });
  } catch (error) {
    console.error("Accept quotation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Complete project (manual)

export const completeProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Only allow customer to mark complete if advance was paid
    if (project.customerRef.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    project.paymentCompleted = true;
    project.status = "completed";
    await project.save();

    res.json({ success: true, message: "Project marked as completed", project });
  } catch (error) {
    console.error("Complete project error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};