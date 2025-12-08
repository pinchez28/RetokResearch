import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// -------------------- IMPORT MODELS --------------------
import './src/models/auth/User.js';
import './src/models/client/Client.js';
import './src/models/expert/Expert.js';
import './src/models/Notification.js';
import './src/models/client/Job.js';
import './src/models/expert/Assignment.js';

// -------------------- IMPORT ROUTES --------------------
import notificationRoutes from './src/routes/notificationRoutes.js';
import authRoutes from './src/routes/auth/authRoutes.js';
import aboutRoutes from './src/routes/guest/aboutRoutes.js';
import serviceRoutes from './src/routes/guest/serviceRoutes.js';
import guestRequestRoutes from './src/routes/guest/guestRequestRoutes.js';
import clientJobRoutes from './src/routes/client/jobRoutes.js';
import adminJobRoutes from './src/routes/admin/jobAdminRoutes.js';
import expertJobRoutes from './src/routes/expert/jobRoutes.js';
import assignmentRoutes from './src/routes/expert/assignmentRoutes.js';
import guestJobRoutes from './src/routes/guest/jobRoutes.js';
import clientDashboardRoutes from './src/routes/client/clientDashboardRoutes.js';
import clientProfileRoutes from './src/routes/client/clientProfileRoutes.js';

// -------------------- Admin --------------------
import adminClientRoutes from './src/routes/admin/adminClientRoutes.js';

dotenv.config();
const app = express();

// -------------------- CORS --------------------
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// --------------------- ADMIN --------------------------------
app.use('/api/admin/clients', adminClientRoutes);

// -------------------- BODY PARSER --------------------
app.use(express.json());

// -------------------- STATIC FOLDER --------------------
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// -------------------- API ROUTES --------------------
// Notifications
app.use('/api/notifications', notificationRoutes);

// Auth
app.use('/api/auth', authRoutes);

// Guest
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/guest-requests', guestRequestRoutes);
app.use('/api/guest/jobs', guestJobRoutes);

// Client
app.use('/api/client/jobs', clientJobRoutes);
app.use('/api/client', clientDashboardRoutes);
app.use('/api/client/profile', clientProfileRoutes);

// Admin
app.use('/api/admin/jobs', adminJobRoutes);

// Expert
app.use('/api/expert', expertJobRoutes);
app.use('/api/expert/assignments', assignmentRoutes);

// -------------------- 404 HANDLER --------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
