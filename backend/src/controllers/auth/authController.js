// ---------------- Signup ----------------
import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import generateToken from '../../../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// Map role to model for populate
const roleModelMap = {
  Client,
  Expert,
};

// ---------------- Signup ----------------
export const signup = async (req, res) => {
  try {
    let {
      role,
      name,
      email,
      password,
      phone,
      specialization,
      bio,
      experience,
      education,
      certifications,
    } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Normalize role
    role = role.trim().toLowerCase();
    if (!['client', 'expert'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Only client or expert allowed.',
      });
    }
    role = role.charAt(0).toUpperCase() + role.slice(1); // → Client | Expert

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    // ----------------------------------
    // STEP 1: Create Profile FIRST
    // ----------------------------------
    let profile;

    if (role === 'Client') {
      profile = await Client.create({
        name,
        phone,
      });
    } else if (role === 'Expert') {
      if (!specialization || !bio || !experience || !education || !req.file) {
        return res.status(400).json({
          message: 'Missing expert-specific fields or photo.',
        });
      }

      profile = await Expert.create({
        name,
        phone,
        photo: `/uploads/experts/${req.file.filename}`,
        specialization,
        bio,
        experience,
        education,
        certifications: certifications
          ? certifications.split(',').map((c) => c.trim())
          : [],
      });
    }

    // ----------------------------------
    // STEP 2: Create User WITH profile
    // ----------------------------------
    const user = await User.create({
      email,
      password,
      role,
      profile: profile._id, // REQUIRED at creation
    });

    // ----------------------------------
    // STEP 3: Update Profile.user
    // ----------------------------------
    profile.user = user._id;
    await profile.save();

    // Generate token
    const token = user.generateToken();

    // Return populated data
    const populatedUser = await User.findById(user._id).populate({
      path: 'profile',
      model: roleModelMap[role],
    });

    res.status(201).json({ token, user: populatedUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    // Generate token
    const token = generateToken(user._id);

    // Populate profile for Client/Expert
    let populatedUser = user;
    if (user.role !== 'Admin') {
      const roleModel = roleModelMap[user.role];
      populatedUser = await User.findById(user._id).populate({
        path: 'profile',
        model: roleModel,
      });
    }

    res.status(200).json({ token, user: populatedUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
