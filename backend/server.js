import dotenv from 'dotenv/config';
import connectDB from './src/config/db.js';
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // or your frontend URL
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in controllers
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join room for real-time notifications
  socket.on('joinRoom', ({ userId, role }) => {
    if (role === 'admin') socket.join('admins');
    else if (role === 'client') socket.join(`client_${userId}`);
    else if (role === 'expert') socket.join(`expert_${userId}`);
    console.log(`${role} ${userId} joined their room`);
  });

  // Example: guest messages (existing feature)
  socket.on('guest-message', (msg) => {
    console.log('Message from guest:', msg);
    io.emit('guest-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
