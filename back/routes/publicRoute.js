import express from 'express';
import { getLandingMetricsAndTeasers } from '../controllers/publicController.js';

const publicRouter = express.Router();

// Public open-access endpoint — No token authentication middleware applied!
publicRouter.get('/landing-preview', getLandingMetricsAndTeasers);

export default publicRouter;