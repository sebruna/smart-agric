import express from 'express';
import { getProfile, getPublicFarmerProfile, updateProfile, uploadConfig } from '../controllers/farmerProfileController.js';
import {authenticateToken} from '../middleware/auth.js';

const farmerProfileRouter = express.Router();

farmerProfileRouter.get('/get', authenticateToken, getProfile);

// 🚀 Inject Multer parser to grab the specific form-data image key: 'profilePicFile'
farmerProfileRouter.put('/add', authenticateToken, uploadConfig.single('profilePicFile'), updateProfile);
farmerProfileRouter.get('/public-profile/:userId', authenticateToken, getPublicFarmerProfile);
// Add this action inside controllers/farmerProfileController.js

export default farmerProfileRouter;