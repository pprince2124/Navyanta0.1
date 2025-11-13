import Category from "../models/categoryModel.js";

// Add Category
export const addCategory = async (req, res) => {
  try {
    const { name, description, sortOrder } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, description, sortOrder, image });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    console.error("Add category error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Categories
export const allCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error("Fetch categories error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};