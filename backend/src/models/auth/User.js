// backend/src/models/auth/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true, // now always required for local auth
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    role: {
      type: String,
      enum: ['Client', 'Expert', 'Admin'],
      required: true,
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'role',
      required: false,
    },
  },
  { timestamps: true },
);

// ==========================
// HASH PASSWORD BEFORE SAVE
// ==========================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ==========================
// CHECK PASSWORD METHOD
// ==========================
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================
// GENERATE JWT METHOD
// ==========================
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  );
};

// ==========================
// MODEL EXPORT
// ==========================
const User = mongoose.model('User', userSchema);
export default User;
