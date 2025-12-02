import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../../utils/generateToken.js';

// Map roles to models for populate
const roleModelMap = {
  Client: 'Client',
  Expert: 'Expert',
  // Admin has no profile
};

// ---------------- Signup ----------------
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
      return res
        .status(400)
        .json({ message: 'Invalid role. Only client or expert allowed.' });
    }
    role = role.charAt(0).toUpperCase() + role.slice(1);

    // Check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    // Create profile
    let profile;
    if (role === 'Client') {
      profile = await Client.create({ name, phone });
    } else if (role === 'Expert') {
      if (!specialization || !bio || !experience || !education || !req.file) {
        return res
          .status(400)
          .json({ message: 'Missing expert-specific fields or photo.' });
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

    // Create User — RAW password, model will hash automatically
    const user = await User.create({
      email,
      password, // model pre-save hook hashes this
      role,
      profile: profile._id,
    });

    // Token
    const token = generateToken(user._id, role);

    // Populate profile
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
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    // Ensure role is proper case
    const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Generate token
    const token = generateToken(user._id, role);

    // Populate profile for client/expert
    let populatedUser = user;
    if (role !== 'Admin') {
      populatedUser = await User.findById(user._id).populate({
        path: 'profile',
        model: roleModelMap[role],
      });
    }

    res.json({ token, user: populatedUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
