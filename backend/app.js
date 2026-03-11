// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

// -------------------- LOAD ENV --------------------
dotenv.config();
const app = express();

// -------------------- IMPORT MODELS --------------------
import './src/models/auth/User.js';
import './src/models/client/Client.js';
import './src/models/expert/Expert.js';
import './src/models/notification/Notification.js';
import './src/models/client/Job.js';
import './src/models/expert/ExpertAssignment.js';
import './src/models/chat/ChatThread.js';

// -------------------- IMPORT ROUTES --------------------
import notificationRoutes from './src/routes/notification/notificationRoutes.js';
import authRoutes from './src/routes/auth/authRoutes.js';
import guestAboutRoutes from './src/routes/guest/guestAboutRoutes.js';
import guestRequestRoutes from './src/routes/guest/guestRequestRoutes.js';
import guestMessageRoutes from './src/routes/guest/guestMessageRoutes.js';
import guestJobRoutes from './src/routes/guest/guestJobRoutes.js';
import clientDashboardRoutes from './src/routes/client/clientDashboardRoutes.js';
import clientProfileRoutes from './src/routes/client/clientProfileRoutes.js';
import clientJobRoutes from './src/routes/client/clientJobRoutes.js';
import clientProposalRoutes from './src/routes/client/clientProposalRoutes.js';
import clientProjectRoutes from './src/routes/client/clientProjectRoutes.js';
import mpesaRoutes from './src/routes/mpesa/mpesaRoutes.js';
import adminServiceRoutes from './src/routes/admin/adminServiceRoutes.js';
import adminClientRoutes from './src/routes/admin/adminClientRoutes.js';
import adminExpertRoutes from './src/routes/admin/adminExpertRoutes.js';
import adminJobRoutes from './src/routes/admin/adminJobRoutes.js';
import adminRoutes from './src/routes/admin/adminRoutes.js';
import adminGuestGuestRequestRoutes from './src/routes/admin/adminGuestRequestRoutes.js';
import adminGuestMessageRoutes from './src/routes/admin/adminGuestMessagesRoutes.js';
import expertRoutes from './src/routes/expert/expertRoutes.js';
import chatRoutes from './src/routes/chat/chatRoutes.js';

// -------------------- CORS --------------------
const allowedOrigins = [
  process.env.FRONTEND_URL, // Render frontend
  'http://localhost:5173', // local dev
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// -------------------- BODY + COOKIE PARSERS --------------------
app.use(express.json());
app.use(cookieParser());

//============== Debugging Middleware ==============
app.use((req, res, next) => {
  console.log('🔥 Incoming request:', req.method, req.path, req.body);
  next();
});

// -------------------- STATIC --------------------
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// -------------------- CHAT ROUTES --------------------
app.use('/api/chats', chatRoutes);

// -------------------- CORE ROUTES --------------------
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// -------------------- GUEST ROUTES --------------------
app.use('/api/guest/about', guestAboutRoutes);
app.use('/api/guest/guest-requests', guestRequestRoutes);
app.use('/api/guest/messages', guestMessageRoutes);
app.use('/api/guest/jobs', guestJobRoutes);

// -------------------- ADMIN ROUTES --------------------
app.use('/api/admin/services', adminServiceRoutes);
app.use('/api/admin/clients', adminClientRoutes);
app.use('/api/admin/experts', adminExpertRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/guest-requests', adminGuestGuestRequestRoutes);
app.use('/api/admin/guest-messages', adminGuestMessageRoutes);

// -------------------- CLIENT ROUTES --------------------
app.use('/api/client/projects', clientProjectRoutes);
app.use('/api/client', clientDashboardRoutes);
app.use('/api/client/profile', clientProfileRoutes);
app.use('/api/client/jobs', clientJobRoutes);
app.use('/api/client', clientProposalRoutes);

// -------------------- MPESA ROUTES --------------------
app.use('/api/mpesa', mpesaRoutes);

// -------------------- EXPERT ROUTES --------------------
app.use('/api/expert', expertRoutes);

// -------------------- 404 HANDLER --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// -------------------- ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
