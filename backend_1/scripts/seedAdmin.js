import dotenv from 'dotenv';
dotenv.config();

import User from '../src/models/User.js';
import connectDB from '../src/config/db.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword, // plain → will be auto-hashed
        role: 'admin',
        isActive: true,
      });

      console.log('Admin user created:', admin.email);
    } else {
      admin.password = adminPassword; // plain → will be auto-hashed
      await admin.save();
      console.log('Admin password updated to match .env');
    }

    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
