import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // ✅ Mobile is now the only required unique identifier
    mobile: { type: String, required: true, unique: true },

    // Email is optional (you can remove it entirely if not needed)
    email: { type: String, sparse: true },

    image: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemS...", // shortened
    },

    phone: { type: String, default: "000000000" },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
    },
    gender: { type: String, default: "Not Selected" },
    dob: { type: String, default: "Not Selected" },

    // ✅ Store hashed password only
    passwordHash: { type: String, required: true },

    role: { type: String, default: "user" },
    loginCount: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
  },
  { timestamps: true }
);

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;