import express from 'express';
import SystemLog from '../models/logModel.js';
import {authenticateToken} from '../middleware/auth.js';

const logRouter = express.Router();

logRouter.get('/logs', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Administrative clearances required.' });
        }
        const logs = await SystemLog.fetchAll();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error pulling system event streams.', error: error.message });
    }
});

export default logRouter;