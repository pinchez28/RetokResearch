import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);

export default app;
