import About from '../../models/guest/About.js';

export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    res.json({ about });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { mission, vision, coreValues } = req.body;

    let about = await About.findOne();

    if (!about) {
      about = new About({ mission, vision, coreValues });
    } else {
      about.mission = mission;
      about.vision = vision;
      about.coreValues = coreValues;
    }

    await about.save();
    res.json({ message: 'About section updated successfully', about });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update about section', error });
  }
};
