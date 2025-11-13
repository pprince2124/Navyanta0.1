import mongoose from "mongoose";

export const PROJECT_STATUS = [
  "requested",
  "quotation_shared",
  "quotation_accepted",
  "advance_paid",     // ✅ new stage
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

const projectSchema = new mongoose.Schema(
  {
    // references
    customerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fabricatorRef: { type: mongoose.Schema.Types.ObjectId, ref: "Fabricator" },
    serviceRef: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },

    // scheduling
    projectDate: { type: Date },
    slotTime: { type: String },

    // lifecycle
    status: { type: String, enum: PROJECT_STATUS, default: "requested", index: true },

    // customer details
    address: { type: String, maxlength: 500 },
    contactNo: { type: String, trim: true },

    // quotation flow
    quotation: {
      specs: { type: Object },
      amount: { type: Number },
      advance: { type: Number },
      quotationDate: { type: Date },
    },
    quotationAccepted: { type: Boolean, default: false },
    quotationFile: { type: String },

    // visit approval
    visitApproved: { type: Boolean, default: false },

    // direct purchase
    directPurchase: { type: Boolean, default: false },

    // payment tracking
    advancePaid: { type: Boolean, default: false },
    paymentCompleted: { type: Boolean, default: false },
    paymentProvider: { type: String, enum: ["razorpay", "stripe", "none"], default: "none" },
    paymentRef: { type: String },

    // audit
    cancellationReason: { type: String, trim: true },
    notes: { type: String, maxlength: 1000 },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// indexes
projectSchema.index({ customerRef: 1, status: 1 });
projectSchema.index({ fabricatorRef: 1, projectDate: 1 });

// ✅ Export with name Project
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;