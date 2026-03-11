import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';
import cron from 'node-cron';

import app from './app.js';
import { initSocket } from './src/sockets/index.js';
import { cleanupUnverifiedUsers } from './src/jobs/cleanUpUnverifiedUser.js';

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    cron.schedule('0 * * * *', async () => {
      console.log('🧹 Running cleanup job...');
      await cleanupUnverifiedUsers();
    });

    console.log('✅ Cleanup scheduler started');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// HTTP server
const server = http.createServer(app);

// Socket.IO
const io = initSocket(server);
app.set('io', io);

// Start server
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
