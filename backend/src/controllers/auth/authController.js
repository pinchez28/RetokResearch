import bcrypt from 'bcryptjs';
import User from '../../models/auth/User.js';
import Client from '../../models/client/Client.js';
import Expert from '../../models/expert/Expert.js';
import generateToken from '../../../utils/generateToken.js';
import sendEmail from '../../../utils/sendEmail.js';

// Map role to model for population
const roleModelMap = { Client, Expert };

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
  try {
    let {
      role,
      name,
      email,
      password,
      phone,
      specialization,
      skills,
      bio,
      experience,
      education,
      certifications,
      portfolio,
    } = req.body;

    // Basic required fields
    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    role = role.trim().toLowerCase();
    if (!['client', 'expert'].includes(role)) {
      return res
        .status(400)
        .json({ message: 'Invalid role. Only client or expert allowed.' });
    }
    role = role.charAt(0).toUpperCase() + role.slice(1); // Client | Expert

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists.' });

    // ---------------- STEP 1: Create profile ----------------
    let profile;
    if (role === 'Client') {
      profile = await Client.create({ name, phone });
    } else if (role === 'Expert') {
      if (!specialization || !bio || !experience || !education) {
        return res
          .status(400)
          .json({ message: 'Missing expert-specific fields.' });
      }

      // Convert skills string into array
      const skillsArray =
        typeof skills === 'string'
          ? skills.split(',').map((s) => s.trim())
          : Array.isArray(skills)
          ? skills
          : [];

      profile = await Expert.create({
        name,
        phone,
        photo: req.file ? `/uploads/experts/${req.file.filename}` : '',
        specialization,
        bio,
        experience,
        education,
        certifications: certifications
          ? certifications.split(',').map((c) => c.trim())
          : [],
        portfolio: portfolio || [],
        skills: skillsArray,
        rating: 0,
        status: 'pending_admin_review', // expert must be approved by admin
      });

      // Notify admin of new expert signup
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
      if (ADMIN_EMAIL) {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: 'New Expert Signup Pending Approval',
          html: `<p>${profile.name} just signed up as an Expert.</p>
                 <p>Skills: ${skillsArray.join(', ')}</p>
                 <p>Approve or reject via admin dashboard.</p>`,
        });
      }
    }

    // ---------------- STEP 2: Create user ----------------
    const user = await User.create({
      email,
      password,
      role,
      profile: profile._id,
    });

    // ---------------- STEP 3: Link profile to user ----------------
    profile.user = user._id;
    await profile.save();

    // ---------------- STEP 4: Response ----------------
    if (role === 'Expert') {
      // Experts do not get a token until approved
      return res.status(201).json({
        message:
          'Expert signup successful. Your account is pending admin approval.',
        status: profile.status,
      });
    }

    // Clients receive token immediately
    const token = generateToken(user._id);
    const populatedUser = await User.findById(user._id).populate({
      path: 'profile',
      model: roleModelMap[role],
      populate: { path: 'user', select: 'email name' },
    });

    res.status(201).json({ token, user: populatedUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ---------------- LOGIN ----------------
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

    // ---------------- Check Expert Status ----------------
    if (user.role === 'Expert') {
      const expertProfile = await Expert.findById(user.profile);
      if (!expertProfile)
        return res.status(404).json({ message: 'Expert profile not found.' });

      if (expertProfile.status !== 'approved') {
        return res.status(403).json({
          message:
            'Your account is not yet approved by the admin. Please wait for approval.',
          status: expertProfile.status,
        });
      }
    }

    const token = generateToken(user._id);

    // Populate profile for response
    let populatedUser = user;
    if (user.role !== 'Admin') {
      populatedUser = await User.findById(user._id).populate({
        path: 'profile',
        model: roleModelMap[user.role],
      });
    }

    res.status(200).json({ token, user: populatedUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
