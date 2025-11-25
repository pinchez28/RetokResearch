import Expert from '../models/Expert.js';

// GET all experts
export const getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find().select('name avatarUrl rating');
    res.json({ success: true, experts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET single expert
export const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CREATE expert
export const createExpert = async (req, res) => {
  try {
    const { name, avatarUrl, rating } = req.body;
    const expert = await Expert.create({ name, avatarUrl, rating });
    res.json({ success: true, expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE expert
export const updateExpert = async (req, res) => {
  try {
    const { name, avatarUrl, rating } = req.body;
    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      { name, avatarUrl, rating },
      { new: true }
    );
    if (!expert)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE expert
export const deleteExpert = async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
