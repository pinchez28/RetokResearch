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

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('guest-message', (msg) => {
    console.log('Message from guest:', msg);
    io.emit('guest-message', msg); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
