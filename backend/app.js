// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './src/routes/authRoutes.js';
import serviceRoutes from './src/routes/serviceRoutes.js';
import guestSubmissionsRoutes from './src/routes/guestSubmissions.js';
import clientMessagesRoutes from './src/routes/clientMessages.js';
import expertMessagesRoutes from './src/routes/expertMessages.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/services', serviceRoutes);
app.use('/api/guest-submissions', guestSubmissionsRoutes);
app.use('/api/client-messages', clientMessagesRoutes);
app.use('/api/expert-messages', expertMessagesRoutes);

export default app;
