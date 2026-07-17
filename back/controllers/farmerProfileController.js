import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FarmerProfile from '../models/farmerProfileModel.js';

// ─── MULTER DISK STORAGE CONFIGURATION ───────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './uploads/profiles';
        // Automatically create the directories path recursive matrix if it doesn't exist yet
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Unique string generation: user_id + timestamp + extension
        const fileExt = path.extname(file.originalname);
        cb(null, `farmer-${req.user.id}-${Date.now()}${fileExt}`);
    }
});

export const uploadConfig = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const isMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (isMatch) return cb(null, true);
        cb(new Error('Only standard image files are allowed (.jpg, .png, .webp)'));
    }
});

// ─── CONTROLLER ACTIONS ──────────────────────────────────────────

export const getProfile = async (req, res) => {
    try {
        if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Access denied.' });
        const profile = await FarmerProfile.findByUserId(req.user.id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profile data.', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (req.user.role !== 'farmer') return res.status(403).json({ message: 'Access denied.' });
       
        // Fetch original existing record properties first to retain old images if none were newly chosen
        const existingProfile = await FarmerProfile.findByUserId(req.user.id);
       
        const farm_name = req.body.farm_name;
        const contact_phone = req.body.contact_phone || null;
        const shipping_hub = req.body.shipping_hub || 'Central Logistics Node';
        const bio = req.body.bio || null;
       
        // If an image file payload came through, assign its target URL webpath string, otherwise fallback to past state
        const profile_pic = req.file ? `/uploads/profiles/${req.file.filename}` : existingProfile.profile_pic;

        if (!farm_name) {
            return res.status(400).json({ message: 'Farm Name configuration title is required.' });
        }
       
        await FarmerProfile.update(req.user.id, { farm_name, contact_phone, shipping_hub, bio, profile_pic });
       
        res.status(200).json({
            message: 'Farmer profile configurations synchronized.',
            profile_pic: profile_pic // Pass back to frontend for instant UI sync
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user metrics.', error: error.message });
    }
};

export const getPublicFarmerProfile = async (req, res) => {
    const { userId } = req.params;
   
    try {
        const farmer = await FarmerProfile.bfp(userId);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile configurations not found.' });
        }
       
        res.status(200).json(farmer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching external profile stub.', error: error.message });
    }
};