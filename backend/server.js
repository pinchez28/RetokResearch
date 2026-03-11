// server.js
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import cron from 'node-cron';

import app from './app.js';
import { initSocket } from './src/sockets/index.js';
import { cleanupUnverifiedUsers } from './src/jobs/cleanUpUnverifiedUser.js';

// -------------------- MONGO --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Cleanup job every 48 hours (runs at midnight every 2 days)
    cron.schedule('0 0 */2 * *', async () => {
      console.log('🧹 Running cleanup job every 48 hours...');
      await cleanupUnverifiedUsers();
    });

    console.log('✅ Cleanup scheduler started');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// -------------------- HTTP SERVER --------------------
const server = http.createServer(app);

// -------------------- SOCKET.IO --------------------
const io = initSocket(server);
app.set('io', io);

// Optional: log socket connections
io.on('connection', (socket) => {
  console.log('🔌 Socket connected', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected', socket.id);
  });
});

// Only log relevant SMTP/env info — NEVER log passwords in public logs
console.log('LIVE ENV VARIABLES:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'MISSING');

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
