import express from "express";
import upload from "../middleware/multer.js";
import { addCategory, allCategories } from "../controllers/categoryController.js";

const router = express.Router();

// Add category (with image upload)
router.post("/add", upload.single("image"), addCategory);

// Get all categories
router.get("/list", allCategories);

export default router;