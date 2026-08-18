import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { initDB } from './db.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT || '5001', 10);

// Middleware
app.use(cors({
  origin: '*', // Allows cross-origin for local client dev and deployed preview
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NotifyHub API Server is running',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/stats',
      '/api/announcements',
      '/api/events',
      '/api/urgent',
      '/api/countdowns',
      '/api/contact'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Function to start server with automatic port fallback
async function startServer(port = DEFAULT_PORT, attempts = 0) {
  if (attempts === 0) {
    try {
      await initDB();
    } catch (dbErr) {
      console.error('Database initialization warning:', dbErr.message);
    }
  }

  const server = app.listen(port, () => {
    console.log(`
=====================================================
 NotifyHub Server is active and listening on port ${port}
 API Base URL: http://localhost:${port}/api
 Health check: http://localhost:${port}/api/health
=====================================================
    `);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      if (attempts < 5) {
        const nextPort = port + 1;
        console.warn(`⚠ Port ${port} is in use. Trying next available port: ${nextPort}...`);
        startServer(nextPort, attempts + 1);
      } else {
        console.error(`❌ Could not bind to ports ${DEFAULT_PORT}-${port}. Please close conflicting processes.`);
      }
    } else {
      console.error('Server listening error:', e.message);
    }
  });
}

startServer();
