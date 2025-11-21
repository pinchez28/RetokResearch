import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register user (with optional photo)
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required fields' });
    }

    // PHOTO HANDLING
    let photo = '';
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    // ROLE-BASED PHOTO REQUIREMENTS
    if (role === 'expert' && !req.file) {
      return res.status(400).json({
        message: `${role.toUpperCase()} must upload a profile photo`,
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (mongoose auto-hashes password)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client', // default if missing
      photo,
    });

    // Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    photo: req.user.photo,
  });
};
