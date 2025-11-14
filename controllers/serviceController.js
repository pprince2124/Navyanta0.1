import Service from "../models/serviceModel.js";

// Add Service
export const addService = async (req, res) => {
  try {
    const {
      name,
      categoryRef,
      shortDescription,
      description,
      hasPricing,
      pricingOptions,
      material,
    } = req.body;

    // ✅ Handle main image
    const image = req.files?.image?.[0]
      ? `/uploads/images/${req.files.image[0].filename}`
      : null;

    // ✅ Handle gallery images
    const gallery = req.files?.gallery
      ? req.files.gallery.map((file) => `/uploads/images/${file.filename}`)
      : [];

    const existing = await Service.findOne({ name, categoryRef });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Service already exists in this category",
      });
    }

    const hasPricingBool = hasPricing === "true" || hasPricing === true;
    let parsedPricing = [];
    if (hasPricingBool && pricingOptions) {
      try {
        parsedPricing =
          typeof pricingOptions === "string"
            ? JSON.parse(pricingOptions)
            : pricingOptions;
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid pricingOptions JSON" });
      }
    }

    const service = await Service.create({
      name,
      categoryRef,
      shortDescription,
      description,
      hasPricing: hasPricingBool,
      pricingOptions: parsedPricing,
      image,
      gallery, // ✅ Save gallery images
      material,
    });

    res
      .status(201)
      .json({ success: true, message: "Service created", data: service });
  } catch (err) {
    console.error("Add service error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Services (with optional filters)
export const allServices = async (req, res) => {
  try {
    const { categoryId, material, search } = req.query;

    const filter = {};

    // Filter by category
    if (categoryId) {
      filter.categoryRef = categoryId;
    }

    // Filter by material (skip if "All")
    if (material && material !== "All") {
      filter.material = material;
    }

    // Optional search by name/description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const services = await Service.find(filter)
      .populate("categoryRef", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (err) {
    console.error("❌ Fetch services error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
// Update Service

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // ✅ Replace main image if provided
    if (req.files?.image?.[0]) {
      service.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    // ✅ Add new gallery images (append to existing)
    if (req.files?.gallery?.length > 0) {
      const newGallery = req.files.gallery.map((f) => `/uploads/images/${f.filename}`);
      service.gallery = [...service.gallery, ...newGallery];
    }

    // ✅ Update other fields
    Object.assign(service, updates);

    // ✅ Parse pricingOptions if needed
    if (updates.hasPricing && updates.pricingOptions) {
      try {
        service.pricingOptions =
          typeof updates.pricingOptions === "string"
            ? JSON.parse(updates.pricingOptions)
            : updates.pricingOptions;
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid pricingOptions JSON" });
      }
    }

    // ✅ Update material if provided
    if (updates.material) {
      service.material = updates.material;
    }

    await service.save();
    res.status(200).json({ success: true, message: "Service updated", data: service });
  } catch (err) {
    console.error("Update service error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Delete Service
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change Service Visibility
export const changeServiceVisibility = async (req, res) => {
  try {
    const { serviceId, isActive } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    service.isActive = isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${isActive ? "activated" : "deactivated"}`,
      data: service,
    });
  } catch (err) {
    console.error("Change visibility error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};