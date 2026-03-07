import Service from '../../models/admin/Service.js';
import mongoose from 'mongoose';

// Utility function to check for valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// -------------------- GET ALL SERVICES --------------------
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }); // sort newest first
    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

// -------------------- GET SERVICE BY ID --------------------
export const getServiceById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid service ID' });
  }

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (err) {
    console.error(`Error fetching service ${id}:`, err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

// -------------------- CREATE SERVICE --------------------
export const createService = async (req, res) => {
  try {
    const {
      title,
      branch,
      category,
      shortDescription,
      fullDescription,
      priceRange,
      includes,
    } = req.body;

    // Basic validation
    if (!title || !branch || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, branch, and category are required',
      });
    }

    const service = await Service.create({
      title,
      branch,
      category,
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      priceRange: priceRange || '',
      includes: Array.isArray(includes) ? includes : [],
    });

    res.status(201).json({ success: true, service });
  } catch (err) {
    console.error('Error creating service:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

// -------------------- UPDATE SERVICE --------------------
export const updateService = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid service ID' });
  }

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }

    const updates = req.body;

    // Optional: Only allow specific fields to be updated
    const allowedUpdates = [
      'title',
      'branch',
      'category',
      'shortDescription',
      'fullDescription',
      'priceRange',
      'includes',
    ];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        service[key] = updates[key];
      }
    });

    await service.save();
    res.json({ success: true, service });
  } catch (err) {
    console.error(`Error updating service ${id}:`, err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};

// -------------------- DELETE SERVICE --------------------
export const deleteService = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid service ID' });
  }

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' });
    }

    await service.remove();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error(`Error deleting service ${id}:`, err);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
};
