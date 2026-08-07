import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from '@/routes/index';
import { errorHandler } from '@/middlewares/error.middleware';

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to known frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'http://localhost:5173',
  'https://affiliate-frontend-bk5i.onrender.com',
  'https://affiliate-management-system-one.vercel.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parser with size limit (prevent large payload attacks)
app.use(express.json({ limit: '1mb' }));

// Global rate limiter — 100 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
}));

// Auth-specific stricter rate limiter — 20 attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

app.use('/api', routes);
app.use(errorHandler);

export default app;
