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

// Add service — accepts main image + gallery images
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  addService
);

// Get all services
router.get("/list", allServices);

// Update service — optionally accepts new main image + gallery
router.put(
  "/:serviceId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateService
);

// Delete service
router.delete("/:id", deleteService);

// Change visibility
router.patch("/visibility", changeServiceVisibility);

export default router;