// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';

// Auth routes
import clientRoutes from './src/routes/auth/clientRoutes.js';
import expertRoutes from './src/routes/auth/expertRoutes.js';

// Other routes
import serviceRoutes from './src/routes/serviceRoutes.js';
import guestSubmissionsRoutes from './src/routes/guestSubmissions.js';
import guestRequestRoutes from './src/routes/guestRequestRoutes.js';
import clientMessagesRoutes from './src/routes/clientMessages.js';
import expertMessagesRoutes from './src/routes/expertMessages.js';
import contactRoutes from './src/routes/contactRoutes.js';
import topRatedExpertsRoutes from './src/routes/topRated.js';
import aboutRoutes from './src/routes/aboutRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth/clients', clientRoutes); // client signup/login
app.use('/api/auth/experts', expertRoutes); // expert signup/login
app.use('/api/services', serviceRoutes);
app.use('/api/guest-submissions', guestSubmissionsRoutes);
app.use('/api/guest-requests', guestRequestRoutes);
app.use('/api/client-messages', clientMessagesRoutes);
app.use('/api/expert-messages', expertMessagesRoutes);
app.use('/api/contact-messages', contactRoutes);
app.use('/api/top-rated-experts', topRatedExpertsRoutes);
app.use('/api/about', aboutRoutes);

export default app;
