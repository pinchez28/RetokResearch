import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
await connectDB();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: '*' }, // adjust in production
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
