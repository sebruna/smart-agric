import SystemSettings from '../models/settingsModel.js';
import SystemLog from '../models/logModel.js'; // Log config changes to our system logs

export const getSettings = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access denied.' });
        const configurations = await SystemSettings.getAll();
        res.status(200).json(configurations);
    } catch (error) {
        res.status(500).json({ message: 'Error pulling system configurations.', error: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access denied.' });
       
        const updates = req.body; // Expecting { marketplace_fee_percent: 2.0, ... }
       
        for (const [key, value] of Object.entries(updates)) {
            await SystemSettings.updateKey(key, value);
        }

        // Record this configuration tweak into the admin logs we built earlier
        await SystemLog.write({
            user_id: req.user.id,
            action_type: 'SETTINGS_MODIFIED',
            description: `Admin updated global parameters: ${JSON.stringify(updates)}`,
            ip_address: req.ip
        });

        res.status(200).json({ message: 'Global ecosystem settings successfully synchronized.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to rewrite system settings variables.', error: error.message });
    }
};