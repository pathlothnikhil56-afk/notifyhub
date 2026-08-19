import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from '../server/src/routes/api.js';
import { initDB } from '../server/src/db.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize DB on warm start
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDB();
      dbInitialized = true;
    } catch (e) {
      console.warn('Neon DB init:', e.message);
    }
  }
  next();
});

// Support both /api/* and direct routes
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
