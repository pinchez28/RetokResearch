import http from 'http';
import app from './app.js';
import { initSocket } from './src/sockets/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// HTTP server
const server = http.createServer(app);

// Init Socket.IO
const io = initSocket(server);
app.set('io', io); // optional: make io accessible via req.app.get('io')

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
