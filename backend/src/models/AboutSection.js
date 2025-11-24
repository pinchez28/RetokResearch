// backend/src/models/AboutSection.js
import mongoose from 'mongoose';

const AboutSectionSchema = new mongoose.Schema(
  {
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    coreValues: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const AboutSection = mongoose.model('AboutSection', AboutSectionSchema);

export default AboutSection;
