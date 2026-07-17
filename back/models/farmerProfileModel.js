// models/farmerProfileModel.js
import db from '../config/db.js';

class FarmerProfile {
    static async findByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM farmer_profiles WHERE user_id = ?',
            [userId]
        );
       
        if (rows.length === 0) {
            await db.execute(
                'INSERT INTO farmer_profiles (user_id, farm_name) VALUES (?, ?)',
                [userId, 'Unconfigured Farm Node']
            );
            const [newRow] = await db.execute('SELECT * FROM farmer_profiles WHERE user_id = ?', [userId]);
            return newRow[0];
        }
       
        return rows[0];
    }

        // 🚀 UPDATED TO INCLUDE THE PROFILE_PIC PARAMETER STRING
    static async update(userId, { farm_name, contact_phone, shipping_hub, bio, profile_pic }) {
        await db.execute(
            `UPDATE farmer_profiles
             SET farm_name = ?, contact_phone = ?, shipping_hub = ?, bio = ?, profile_pic = ?
             WHERE user_id = ?`,
            [farm_name, contact_phone, shipping_hub, bio, profile_pic, userId]
        );
        return true;
    }

    static async bfp(userId){
        const [rows] = await db.execute(
            `SELECT farm_name, shipping_hub, bio, profile_pic
             FROM farmer_profiles
             WHERE user_id = ?`,
            [userId]
        );
        return rows[0];
    }
}

export default FarmerProfile;