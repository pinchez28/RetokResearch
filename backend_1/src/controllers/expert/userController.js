import User from '../models/auth/Client.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ---------------- Signup ----------------
export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      password,
      specialization,
      bio,
      experience,
      education,
      certifications,
    } = req.body;

    if (!name || !email || !phone || !role || !password) {
      return res
        .status(400)
        .json({ message: 'All common fields are required.' });
    }

    if (role === 'expert') {
      if (!req.file)
        return res
          .status(400)
          .json({ message: 'Expert profile photo is required.' });
      if (!specialization || !bio || !experience || !education) {
        return res
          .status(400)
          .json({ message: 'All expert-specific fields are required.' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      photo:
        role === 'expert' ? `/uploads/experts/${req.file.filename}` : undefined,
      specialization: role === 'expert' ? specialization : undefined,
      bio: role === 'expert' ? bio : undefined,
      experience: role === 'expert' ? experience : undefined,
      education: role === 'expert' ? education : undefined,
      certifications:
        role === 'expert'
          ? certifications
            ? JSON.parse(certifications)
            : []
          : [],
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({ token, user: newUser });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
