import db from '../config/db.js';

class SystemSettings {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM system_settings');
        // Reduce rows array into a clean key-value object map: { marketplace_fee_percent: '1.5', ... }
        return rows.reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});
    }

    static async updateKey(key, value) {
        await db.execute(
            'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
            [String(value), key]
        );
        return true;
    }
}

export default SystemSettings;