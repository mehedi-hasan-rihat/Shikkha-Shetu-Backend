import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

import tutorRoutes from './modules/tutor/tutor.routes';
import studentRoutes from './modules/student/student.routes';
import adminRoutes from './modules/admin/admin.routes';
import bookingRoutes from './modules/booking/booking.routes';
import reviewRoutes from './modules/review/review.routes';


dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));

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
app.use('/api/categories', adminRoutes);


app.get('/', (req, res) => {
  res.send("Hello from the Tutoring Platform API!");
});

export default app;