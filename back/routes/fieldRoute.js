import express from 'express';
import { getAllFields, createField } from '../controllers/fieldController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const fieldRouter = express.Router();
fieldRouter.use(authenticateToken);

// Admins and Farmers can view fields (Buyers don't need access to this endpoint)
fieldRouter.get('/get', authorizeRoles('admin', 'farmer'), getAllFields);

// Only Farmers can build/register fields (Admins can be allowed too if they manage them)
fieldRouter.post('/add', authorizeRoles('farmer', 'admin'), createField);

export default fieldRouter;