import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // ✅ import jwt

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Role must be one of these
    role: {
      type: String,
      enum: ['Client', 'Expert', 'Admin'],
      required: true,
    },

    // Dynamic profile reference based on role
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role', // resolves to Client, Expert, or Admin collection
      required: true, // ✅ profile must exist
    },
  },
  { timestamps: true }
);

// Encrypt password before saving (if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

export default User;
