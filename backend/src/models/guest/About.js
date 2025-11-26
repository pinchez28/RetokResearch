import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  coreValues: [
    {
      title: { type: String },
      description: { type: String }
    }
  ]
});

export default mongoose.model("About", aboutSchema);
