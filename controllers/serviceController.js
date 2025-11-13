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
    } = req.body;

    // ✅ Save image path under /uploads/images
    const image = req.file ? `/uploads/images/${req.file.filename}` : null;

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
    });

    res
      .status(201)
      .json({ success: true, message: "Service created", data: service });
  } catch (err) {
    console.error("Add service error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Services
export const allServices = async (req, res) => {
  try {
    const services = await Service.find()
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

    // ✅ Consistent image path
    const image = req.file ? `/uploads/images/${req.file.filename}` : null;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    Object.assign(service, updates);
    if (image) service.image = image;

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

    await service.save();
    res
      .status(200)
      .json({ success: true, message: "Service updated", data: service });
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