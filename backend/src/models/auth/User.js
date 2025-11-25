import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['client', 'expert', 'admin'], // match model names
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role', // dynamic reference to role-specific profile
    },
  },
  { timestamps: true }
);

// Password verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
