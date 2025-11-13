import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const ensureAdminExists = async () => {
  try {
    const existingAdmin = await User.findOne({ mobile: process.env.ADMIN_MOBILE });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const admin = new User({
        name: "Super Admin",
        mobile: process.env.ADMIN_MOBILE,
        role: "admin",
        passwordHash: hashedPassword,
      });

      await admin.save();
      console.log("✅ Default admin created:", admin.mobile);
    } else {
      console.log("⚠️ Admin already exists:", existingAdmin.mobile);
    }
  } catch (err) {
    console.error("❌ Error ensuring admin:", err);
  }
};

export default ensureAdminExists;