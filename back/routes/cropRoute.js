import express from 'express';
import { logCropBatch, getMyCrops, getMarketplaceCrops } from '../controllers/cropController.js';
import {authenticateToken} from '../middleware/auth.js'; // Ensure path matches your setup

const cropRouter = express.Router();

// Apply the JWT authentication interceptor globally across all crop operations
cropRouter.use(authenticateToken);

cropRouter.post('/add', logCropBatch); // POST /api/crops
cropRouter.get('/get', getMyCrops);    // GET /api/crops
cropRouter.get('/marketplace', getMarketplaceCrops); // GET /api/crops/marketplace

export default cropRouter;