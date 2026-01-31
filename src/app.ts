import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

import tutorRoutes from './modules/tutor/tutor.routes';
import studentRoutes from './modules/student/student.routes';
import adminRoutes from './modules/admin/admin.routes';


dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Better Auth handles all auth routes
app.all('/api/auth/*', toNodeHandler(auth));

// Module routes
app.use('/api/tutors', tutorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send("Hello from the Tutoring Platform API!");
});

export default app;