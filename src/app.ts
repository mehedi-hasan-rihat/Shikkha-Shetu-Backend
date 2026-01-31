import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';

import tutorRoutes from './modules/tutor/tutor.routes';


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
app.use('/api/tutor', tutorRoutes);


app.get('/', (req, res) => {
  res.send("Hello from the Tutoring Platform API!");
});

export default app;