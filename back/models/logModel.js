// models/logModel.js
import db from '../config/db.js';

class SystemLog {
    static async write({ user_id, action_type, description, ip_address }) {
        try {
            await db.execute(
                'INSERT INTO system_logs (user_id, action_type, description, ip_address) VALUES (?, ?, ?, ?)',
                [user_id || null, action_type, description, ip_address || null]
            );
        } catch (error) {
            console.error('Failed to record system audit log entry:', error.message);
        }
    }

    static async fetchAll() {
        const [rows] = await db.execute(
            `SELECT system_logs.*, users.name AS operator_name, users.email AS operator_email
             FROM system_logs
             LEFT JOIN users ON system_logs.user_id = users.id
             ORDER BY system_logs.created_at DESC LIMIT 250`
        );
        return rows;
    }
}

export default SystemLog;