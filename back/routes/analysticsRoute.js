// routes/analyticsRoutes.js
import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import {authenticateToken} from '../middleware/auth.js';

const analysticsRouter = express.Router();
analysticsRouter.get('/overview', authenticateToken, getDashboardStats);

export default analysticsRouter;