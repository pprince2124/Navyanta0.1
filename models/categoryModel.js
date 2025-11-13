import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    image: { type: String }, // optional banner/icon
    isActive: { type: Boolean, default: true }, // visibility toggle
    sortOrder: { type: Number, default: 0 }, // for frontend ordering
    description: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Indexes for performance
categorySchema.index({ isActive: 1, sortOrder: 1 });

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;