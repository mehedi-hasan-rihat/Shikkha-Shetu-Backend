import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import tutorRoutes from "./modules/tutor/tutor.routes";
import studentRoutes from "./modules/student/student.routes";
import adminRoutes from "./modules/admin/admin.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import reviewRoutes from "./modules/review/review.routes";

dotenv.config();

const app = express();

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in allowedOrigins or matches Vercel preview pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/shikkha-setu-frontend.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    }),
);

app.use(express.json());

// API logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Better Auth handles all auth routes
app.all('/api/auth/*', toNodeHandler(auth));

// Module routes
app.use('/api/tutors', tutorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);


app.get('/', (req, res) => {
  res.send("Hello from the Tutoring Platform API!");
});

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ 
      error: "Resource already exists", 
      details: "This record already exists in the database" 
    });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ 
      error: "Resource not found", 
      details: "The requested resource was not found" 
    });
  }
  
  if (err.code === 'P2003') {
    return res.status(400).json({ 
      error: "Invalid reference", 
      details: "Referenced resource does not exist" 
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: err.message 
    });
  }
  
  // JWT/Auth errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: "Invalid token", 
      details: "Authentication token is invalid" 
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: "Token expired", 
      details: "Authentication token has expired" 
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Route not found", 
    details: `${req.method} ${req.originalUrl} not found` 
  });
});

export default app;