import db from '../config/db.js';

class Order {
    // 1. Submit a trade proposal contract
    static async create({ crop_id, buyer_id, offer_price, quantity_kg }) {
        const [result] = await db.execute(
            'INSERT INTO orders (crop_id, buyer_id, offer_price, quantity_kg) VALUES (?, ?, ?, ?)',
            [crop_id, buyer_id, offer_price, quantity_kg]
        );
        return result.insertId;
    }

    // 2. Buyer views their submitted contracts
    static async findByBuyerId(buyerId) {
        const [rows] = await db.execute(
            `SELECT orders.*, crops.crop_type, users.name AS farmer_name
             FROM orders
             JOIN crops ON orders.crop_id = crops.id
             JOIN fields ON crops.field_id = fields.id
             JOIN users ON fields.farmer_id = users.id
             WHERE orders.buyer_id = ?`,
            [buyerId]
        );
        return rows;
    }

    // 4. Update contract statuses (Accept / Reject)
    static async updateStatus(orderId, status) {
        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );
        return result.affectedRows;
    }

    static async findIncomingByFarmerId(farmerId) {
        const [rows] = await db.execute(
            `SELECT orders.*, crops.crop_type, users.name AS buyer_name,
                    /* We set a mock market baseline price based on the crop type */
                    CASE
                        WHEN crops.crop_type LIKE '%Wheat%' THEN 3.50
                        WHEN crops.crop_type LIKE '%Corn%' THEN 2.00
                        WHEN crops.crop_type LIKE '%Tomato%' THEN 1.50
                        ELSE 2.50 -- Default baseline fallback price
                    END as market_baseline,
                    /* Calculate if the offer price drops 20% or more below baseline */
                    CASE
                        WHEN orders.offer_price <= (
                            CASE
                                WHEN crops.crop_type LIKE '%Wheat%' THEN 3.50 * 0.80
                                WHEN crops.crop_type LIKE '%Corn%' THEN 2.00 * 0.80
                                WHEN crops.crop_type LIKE '%Tomato%' THEN 1.50 * 0.80
                                ELSE 2.50 * 0.80
                            END
                        ) THEN 'CRITICAL_LOW'
                        ELSE 'STANDARD'
                    END as price_evaluation
             FROM orders
             JOIN crops ON orders.crop_id = crops.id
             JOIN fields ON crops.field_id = fields.id
             JOIN users ON orders.buyer_id = users.id
             WHERE fields.farmer_id = ?`,
            [farmerId]
        );
        return rows;
    }
}

export default Order;