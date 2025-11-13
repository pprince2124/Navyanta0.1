// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure base uploads folder exists
const baseUploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide subfolder based on mimetype
    let subfolder = "misc";
    if (file.mimetype === "application/pdf") subfolder = "quotations";
    else if (file.mimetype.startsWith("image/")) subfolder = "images";

    const uploadPath = path.join(baseUploadPath, subfolder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

// File filter: allow PDFs and images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or image files are allowed"), false);
  }
};

// Create the multer instance
const upload = multer({ storage, fileFilter });

export default upload;