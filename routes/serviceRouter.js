import express from "express";
import upload from "../middleware/multer.js";
import {
  addService,
  allServices,
  updateService,
  deleteService,
  changeServiceVisibility,
} from "../controllers/serviceController.js";

const router = express.Router();

// Add service
router.post("/add", upload.single("image"), addService);

// Get all services
router.get("/list", allServices);

// Update service
router.put("/:serviceId", upload.single("image"), updateService);

// Delete service
router.delete("/:id", deleteService);

// Change visibility
router.patch("/visibility", changeServiceVisibility);

export default router;