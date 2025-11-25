import AboutSection from '../models/AboutSection.js';

// Get About Section
export const getAboutSection = async (req, res) => {
  try {
    const about = await AboutSection.findOne({});
    res.json({ success: true, about });
  } catch (err) {
    console.error('GET About Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create or Update (Upsert)
export const upsertAboutSection = async (req, res) => {
  try {
    const { mission, vision, coreValues } = req.body;

    let about = await AboutSection.findOne({});

    if (!about) {
      about = await AboutSection.create({ mission, vision, coreValues });
    } else {
      about.mission = mission;
      about.vision = vision;
      about.coreValues = coreValues;
      await about.save();
    }

    res.json({ success: true, about });
  } catch (err) {
    console.error('UPSERT About Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update only Mission
export const updateMission = async (req, res) => {
  try {
    let about = await AboutSection.findOne({});
    if (!about) about = await AboutSection.create({});

    about.mission = req.body.mission;
    await about.save();

    res.json({ success: true, mission: about.mission });
  } catch (err) {
    console.error('UPDATE Mission Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update only Vision
export const updateVision = async (req, res) => {
  try {
    let about = await AboutSection.findOne({});
    if (!about) about = await AboutSection.create({});

    about.vision = req.body.vision;
    await about.save();

    res.json({ success: true, vision: about.vision });
  } catch (err) {
    console.error('UPDATE Vision Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add Core Value
export const addCoreValue = async (req, res) => {
  try {
    let about = await AboutSection.findOne({});
    if (!about) about = await AboutSection.create({ coreValues: [] });

    const value = {
      title: req.body.title,
      description: req.body.description,
    };

    about.coreValues.push(value);
    await about.save();

    res.json({ success: true, coreValues: about.coreValues });
  } catch (err) {
    console.error('ADD Core Value Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a specific Core Value
export const updateCoreValue = async (req, res) => {
  try {
    let about = await AboutSection.findOne({});
    if (!about)
      return res.status(404).json({ success: false, message: 'Not found' });

    const { id } = req.params;
    const { title, description } = req.body;

    const cv = about.coreValues.id(id);
    if (!cv)
      return res
        .status(404)
        .json({ success: false, message: 'Core value not found' });

    cv.title = title;
    cv.description = description;

    await about.save();

    res.json({ success: true, coreValues: about.coreValues });
  } catch (err) {
    console.error('UPDATE Core Value Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a specific Core Value
export const deleteCoreValue = async (req, res) => {
  try {
    let about = await AboutSection.findOne({});
    if (!about)
      return res.status(404).json({ success: false, message: 'Not found' });

    const { id } = req.params;

    about.coreValues = about.coreValues.filter((v) => v._id.toString() !== id);
    await about.save();

    res.json({ success: true, coreValues: about.coreValues });
  } catch (err) {
    console.error('DELETE Core Value Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete the entire About page
export const deleteAboutSection = async (req, res) => {
  try {
    const about = await AboutSection.findOne({});
    if (!about)
      return res
        .status(404)
        .json({ success: false, message: 'About page already empty' });

    await AboutSection.deleteOne({ _id: about._id });

    res.json({ success: true, message: 'About page deleted completely' });
  } catch (err) {
    console.error('DELETE About Page Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
