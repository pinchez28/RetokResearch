import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

// Auth & Guest Routes
import authRoutes from './src/routes/auth/authRoutes.js';
import aboutRoutes from './src/routes/guest/aboutRoutes.js';
import serviceRoutes from './src/routes/guest/serviceRoutes.js';
import guestRequestRoutes from './src/routes/guest/guestRequestRoutes.js';

// Job Routes
import clientJobRoutes from './src/routes/client/jobRoutes.js';
import adminJobRoutes from './src/routes/admin/jobAdminRoutes.js';
import expertJobRoutes from './src/routes/expert/jobRoutes.js';
import assignmentRoutes from './src/routes/expert/assignmentRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

// Attach io to app so controllers can access
app.set('io', io);

// Track connected users and join rooms
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', ({ userId, role }) => {
    if (role === 'admin') socket.join('admins');
    else if (role === 'client') socket.join(`client_${userId}`);
    else if (role === 'expert') socket.join(`expert_${userId}`);
    console.log(`${role} ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/guest-requests', guestRequestRoutes);

// Job routes
app.use('/api/client/jobs', clientJobRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/expert/jobs', expertJobRoutes);
app.use('/api/expert/assignments', assignmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export { server }; // export server to start with io
export default app;
