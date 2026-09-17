import dotenv from 'dotenv';
dotenv.config();

// Debug: Check if environment variables are loaded in server.js (commented out for production)
// console.log('Server.js - Environment check:');
// console.log('APPWRITE_ENDPOINT:', process.env.APPWRITE_ENDPOINT);
// console.log('APPWRITE_PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './src/routes/auth.js';
import postRoutes from './src/routes/posts.js';
import imageRoutes from './src/routes/images.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { requestLogger } from './src/middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan('combined'));
app.use(requestLogger); // Custom request logging
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/images', imageRoutes);

app.get('/', (req, res) =>{
    res.json({ 
    message: 'Blog Backend API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// Global error handling - must be last
app.use(notFound);
app.use(errorHandler);

// Only listen directly when not running in serverless environment (e.g. Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
}

export default app;