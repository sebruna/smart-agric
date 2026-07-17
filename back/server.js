import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import fieldRouter from './routes/fieldRoute.js';
import userRouter from './routes/userRoute.js';
import cropRouter from './routes/cropRoute.js';
import analysticsRouter from './routes/analysticsRoute.js';
import orderRouter from './routes/orderRoute.js';
import logRouter from './routes/logRoute.js';
import publicRouter from './routes/publicRoute.js';
import path from 'path';
import farmerProfileRouter from './routes/farmerProfileRoute.js';
import settingsRouter from './routes/settingsRoute.js';
import initDataBase from './config/initdb.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential payload parsing filtering block

// Core Route Mount Points
app.use('/api/field', fieldRouter);
app.use('/api/user', userRouter);
app.use('/api/crop', cropRouter);
app.use('/api/analytics', analysticsRouter);
app.use('/api/orders', orderRouter);
app.use('/api/admin', logRouter);
app.use('/api/public', publicRouter);
app.use('/api/farmer', farmerProfileRouter);
app.use('/api/admin-panel', settingsRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Base sanity check probe route
app.get('/', (req, res) => {
  res.json({ status: "online", service: "Smart Agriculture API is running on SE logic...😎" });
});
initDataBase();
// Run Execution Layout
app.listen(PORT, '0,0,0,0', () => {
  console.log(`✔ Server running directly on port ${PORT}`);
});