// routes/adminSettingsRoutes.js
import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import {authenticateToken} from '../middleware/auth.js';

const settingsRouter = express.Router();

settingsRouter.get('/settings', authenticateToken, getSettings);
settingsRouter.put('/settings', authenticateToken, updateSettings);

export default settingsRouter;