import db from '../config/db.js';

class Crop {
    // 1. Create a new crop batch linked to a specific field plot
    static async create({ field_id, crop_type, status, planted_at }) {
        const [result] = await db.execute(
            'INSERT INTO crops (field_id, crop_type, status, planted_at) VALUES (?, ?, ?, ?)',
            [
                field_id ?? null,
                crop_type ?? null,
                status ?? 'planted',
                planted_at ?? null
            ]
        );
        return result.insertId;
    }

    // 2. Fetch all crops belonging to a specific farmer by joining on the fields table
    static async findByFarmerId(farmerId) {
        const [rows] = await db.execute(
            `SELECT crops.*, fields.name AS field_name
             FROM crops
             JOIN fields ON crops.field_id = fields.id
             WHERE fields.farmer_id = ?`,
            [farmerId]
        );
        return rows;
    }

    // 3. Optional: Global fetch for the Admin Panel summaries
    static async findAll() {
        const [rows] = await db.execute(
            `SELECT crops.*, fields.name AS field_name, users.name AS farmer_name
             FROM crops
             JOIN fields ON crops.field_id = fields.id
             JOIN users ON fields.farmer_id = users.id`
        );
        return rows;
    }

    // Add this inside your Crop class in models/cropModel.js
    static async findMarketplaceCrops() {
        const [rows] = await db.execute(
            `SELECT crops.id, crops.crop_type, crops.status, crops.planted_at,
                    fields.name AS field_name, fields.location, fields.farmer_id AS farmer_id,
                    users.name AS farmer_name
             FROM crops
             JOIN fields ON crops.field_id = fields.id
             JOIN users ON fields.farmer_id = users.id
             WHERE crops.status IN ('growing', 'harvested')
             ORDER BY crops.planted_at DESC`
        );
        return rows;
    }

    static async fetchPublicTeaserListings() {
        const [rows] = await db.execute(
            `SELECT crops.id, crops.crop_type, crops.status,
                    fields.location AS broad_region
             FROM crops
             JOIN fields ON crops.field_id = fields.id
             WHERE crops.status IN ('growing', 'harvested')
             ORDER BY crops.planted_at DESC
             LIMIT 6` // Cap it at 6 items for a clean landing preview grid
        );
        return rows;
    }
}

export default Crop;