import Expert from '../../models/Expert.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      bio,
      experience,
      education,
      certifications,
    } = req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !specialization ||
      !bio ||
      !experience ||
      !education ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ message: 'All expert fields including photo are required.' });
    }

    const existing = await Expert.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const expert = new Expert({
      name,
      email,
      phone,
      password: hashed,
      photo: `/uploads/experts/${req.file.filename}`,
      specialization,
      bio,
      experience,
      education,
      certifications: certifications ? JSON.parse(certifications) : [],
    });

    await expert.save();

    const token = jwt.sign(
      { id: expert._id, role: 'expert' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required.' });

    const expert = await Expert.findOne({ email });
    if (!expert)
      return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, expert.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: expert._id, role: 'expert' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: expert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
