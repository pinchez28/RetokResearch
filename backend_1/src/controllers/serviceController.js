import Service from '../models/Service.js';

/**
 * Get all services
 * Returns a flat array to match frontend table
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
};

/**
 * Get a service by ID
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({ message: 'Server error while fetching service' });
  }
};

/**
 * Create a new service
 */
export const createService = async (req, res) => {
  try {
    const {
      title,
      branch,
      category,
      shortDescription,
      fullDescription,
      priceRange,
      featured,
    } = req.body;

    if (
      !title ||
      !branch ||
      !category ||
      !shortDescription ||
      !fullDescription ||
      !priceRange
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    // Avoid duplicates
    const exists = await Service.findOne({
      title: title.trim().toLowerCase(),
      branch: branch.trim().toLowerCase(),
      category: category.trim().toLowerCase(),
    });
    if (exists)
      return res.status(409).json({ message: 'Service already exists' });

    const service = new Service({
      title: title.trim(),
      branch: branch.trim(),
      category: category.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      priceRange: priceRange.trim(),
      featured: !!featured,
    });

    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error while creating service' });
  }
};

/**
 * Update an existing service
 */
export const updateService = async (req, res) => {
  try {
    const {
      title,
      branch,
      category,
      shortDescription,
      fullDescription,
      priceRange,
      featured,
    } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        branch: branch?.trim(),
        category: category?.trim(),
        shortDescription: shortDescription?.trim(),
        fullDescription: fullDescription?.trim(),
        priceRange: priceRange?.trim(),
        featured: featured ?? false,
      },
      { new: true, runValidators: true }
    );

    if (!updatedService)
      return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error while updating service' });
  }
};

/**
 * Delete a service
 */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
};
