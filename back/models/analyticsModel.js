// models/analyticsModel.js
import db from '../config/db.js';

class Analytics {
    static async getSystemOverview() {
        // Run aggregation queries simultaneously across tables
        const [userCount] = await db.execute('SELECT COUNT(*) as total FROM users');
        const [fieldCount] = await db.execute('SELECT COUNT(*) as total FROM fields');
        const [cropCount] = await db.execute('SELECT COUNT(*) as total FROM crops');
       
        // Get crop breakdown statuses
        const [cropStatuses] = await db.execute(
            'SELECT status, COUNT(*) as count FROM crops GROUP BY status'
        );

        return {
            totalUsers: userCount[0].total,
            totalFields: fieldCount[0].total,
            totalCrops: cropCount[0].total,
            cropBreakdown: cropStatuses
        };
    }
}

export default Analytics;