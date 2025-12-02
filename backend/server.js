import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

// -------------------- DATABASE CONNECTION --------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// -------------------- SERVER & SOCKET.IO --------------------
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Socket.IO CORS (separate from Express)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});
app.set('io', io);

// -------------------- SOCKET CONNECTION --------------------
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ userId, role }) => {
    if (role === 'admin') socket.join('admins');
    else if (role === 'client') socket.join(`client_${userId}`);
    else if (role === 'expert') {
      socket.join(`expert_${userId}`);
      socket.join('experts'); // global expert broadcast room
    }
    console.log(`${role} ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// -------------------- START SERVER --------------------
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { server, io };
