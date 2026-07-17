import db from '../config/db.js';

class Field {
    // Admin view: fetch everything
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM fields');
        return rows;
    }

    // Farmer view: fetch only their specific fields
    static async getByFarmerId(farmerId) {
        const [rows] = await db.execute('SELECT * FROM fields WHERE farmer_id = ?', [farmerId]);
        return rows;
    }

    // Create a field bound to a specific farmer
    static async create(farmerId, name, location, size) {
        const [result] = await db.execute(
            'INSERT INTO fields (farmer_id, name, location, size_hectares) VALUES (?, ?, ?, ?)',
            [farmerId, name, location, size]
        );
        return result.insertId;
    }
}

export default Field;