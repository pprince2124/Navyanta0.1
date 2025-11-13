// config/connectCloudinary.js
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      secure: true, // ensures HTTPS delivery
    });

    console.log("✅ Cloudinary configured successfully");
  } catch (err) {
    console.error("❌ Cloudinary config failed:", err.message);
  }
};

export default connectCloudinary;
