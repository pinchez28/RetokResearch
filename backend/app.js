import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// -------------------- IMPORT MODELS --------------------
import './src/models/auth/User.js';
import './src/models/client/Client.js';
import './src/models/expert/Expert.js';
import './src/models/notification/Notification.js';
import './src/models/client/Job.js';
import './src/models/expert/ExpertAssignment.js';

// -------------------- IMPORT ROUTES --------------------
import notificationRoutes from './src/routes/notification/notificationRoutes.js';
import authRoutes from './src/routes/auth/authRoutes.js';

// Guest routes
import guestAboutRoutes from './src/routes/guest/guestAboutRoutes.js';
import guestServiceRoutes from './src/routes/guest/guestServiceRoutes.js';
import guestRequestRoutes from './src/routes/guest/guestRequestRoutes.js';
import guestJobRoutes from './src/routes/guest/guestJobRoutes.js';

// Client routes
import clientJobRoutes from './src/routes/client/clientJobRoutes.js';
import clientDashboardRoutes from './src/routes/client/clientDashboardRoutes.js';
import clientProfileRoutes from './src//routes/client/clientProfileRoutes.js';

// Admin routes
import adminClientRoutes from './src/routes/admin/adminClientRoutes.js';
import adminExpertRoutes from './src/routes/admin/adminExpertRoutes.js';
import adminJobRoutes from './src/routes/admin/adminJobRoutes.js';

// Expert routes
import expertJobRoutes from './src/routes/expert/expertJobRoutes.js';
import expertAssignmentRoutes from './src/routes/expert/expertAssignmentRoutes.js';

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
app.use('/api/about', guestAboutRoutes);
app.use('/api/services', guestServiceRoutes);
app.use('/api/guest-requests', guestRequestRoutes);
app.use('/api/guest/jobs', guestJobRoutes);

// Client
app.use('/api/client/jobs', clientJobRoutes);
app.use('/api/client', clientDashboardRoutes);
app.use('/api/client/profile', clientProfileRoutes);

// Admin
app.use('/api/admin/clients', adminClientRoutes);
app.use('/api/admin/experts', adminExpertRoutes);
app.use('/api/admin/jobs', adminJobRoutes);

// Expert
app.use('/api/expert/assignments', expertAssignmentRoutes);
app.use('/api/expert/jobs', expertJobRoutes);

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
