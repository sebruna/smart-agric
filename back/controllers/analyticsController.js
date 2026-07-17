// controllers/analyticsController.js
import Analytics from '../models/analyticsModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Administrative access required.' });
        }
        const stats = await Analytics.getSystemOverview();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error compiling analytics analytics data.', error: error.message });
    }
};