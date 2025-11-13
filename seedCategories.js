// seedCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/categoryModel.js";

dotenv.config();

const seedCategories = async () => {
  try {
    // ✅ Use the same variable name as in your .env
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");

    // Clear old categories (optional)
    await Category.deleteMany();

    // Insert default categories
    const categories = await Category.insertMany([
      { name: "Windows", slug: "windows", isActive: true, sortOrder: 1 },
      { name: "Doors", slug: "doors", isActive: true, sortOrder: 2 },
      { name: "Cabins", slug: "cabins", isActive: true, sortOrder: 3 },
      { name: "Interiors", slug: "interiors", isActive: true, sortOrder: 4 },
    ]);

    console.log("🌱 Categories seeded:");
    categories.forEach((cat) =>
      console.log(`- ${cat.name}: ${cat._id.toString()}`)
    );

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err.message);
    process.exit(1);
  }
};

seedCategories();