import Crop from '../models/cropModel.js';

// Create a new crop batch
export const logCropBatch = async (req, res) => {
    const { field_id, crop_type, status, planted_at } = req.body;

    // Strict Request Validation Guard
    if (!field_id || !crop_type || !planted_at) {
        return res.status(400).json({
            message: 'Validation error: "field_id", "crop_type", and "planted_at" are required parameters.'
        });
    }

    try {
        const cropId = await Crop.create({ field_id, crop_type, status, planted_at });
        res.status(201).json({
            message: 'Crop batch successfully initialized and tracked.',
            cropId
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error logging crop batch.', error: error.message });
    }
};

// Get crop inventories belonging explicitly to the logged-in user context
export const getMyCrops = async (req, res) => {
    try {
        let crops;

        // If an Admin requests, let them see everything, otherwise filter by the logged-in farmer's token ID
        if (req.user.role === 'admin') {
            crops = await Crop.findAll();
        } else {
            crops = await Crop.findByFarmerId(req.user.id);
        }

        res.status(200).json(crops);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error retrieving crops.', error: error.message });
    }
};

export const getMarketplaceCrops = async (req, res) => {
    try {
        const crops = await Crop.findMarketplaceCrops();
        res.status(200).json(crops);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving marketplace listings.', error: error.message });
    }
};