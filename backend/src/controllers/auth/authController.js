import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import bcrypt from 'bcryptjs';
import generateToken from '../../../utils/generateToken.js';

// Map roles to models for populate
const roleModelMap = {
  client: 'Client',
  expert: 'Expert',
  // admin has no profile
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

    // Normalize role to lowercase
    role = role?.trim().toLowerCase();

    // Validate role (only client/expert allowed via frontend)
    if (!['client', 'expert'].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Invalid role. Only client or expert allowed.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create role-specific profile
    let profile;
    if (role === 'client') {
      profile = await Client.create({ name, phone });
    } else if (role === 'expert') {
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

    // Create User
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      profile: profile._id,
    });

    // Generate token
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

    // Generate token
    const token = generateToken(user._id, user.role);

    // Populate profile only for client/expert
    let populatedUser;
    if (user.role === 'admin') {
      populatedUser = user; // no profile
    } else {
      populatedUser = await User.findById(user._id).populate({
        path: 'profile',
        model: roleModelMap[user.role],
      });
    }

    res.json({ token, user: populatedUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
