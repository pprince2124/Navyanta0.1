import mongoose from "mongoose";

// Pricing sub-schema
const pricingSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "Per sq. ft."
    amount: { type: Number, required: true }, // base price
    unit: { type: String, default: "" }, // e.g. "sqft", "piece"
    currency: { type: String, default: "INR" },
    isDefault: { type: Boolean, default: false }, // mark one as primary
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // visuals
    image: { type: String },
    gallery: [{ type: String }],

    // content
    shortDescription: { type: String, maxlength: 300 },
    description: { type: String, maxlength: 2000 },

    // pricing
    hasPricing: { type: Boolean, default: false },
    pricingOptions: [pricingSchema],

    // NEW: material category
    material: {
      type: String,
      enum: ["Steel", "Aluminium", "Wood", "All"],
      default: "Aluminium",
    },

    // availability
    isActive: { type: Boolean, default: true },
    avgLeadDays: { type: Number, default: 7 },

    // metadata
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Auto-generate slug from name
serviceSchema.pre("validate", function (next) {
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
serviceSchema.index({ categoryRef: 1, isActive: 1 });
serviceSchema.index({ slug: 1 }, { unique: true });

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;