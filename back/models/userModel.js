import db from '../config/db.js';

class User {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async create({ name, email, password_hash, role }) {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, role || 'farmer']
        );
        return result.insertId;
    }

    // Add this inside your User class in models/userModel.js
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    static async updateRole(id, newRole) {
        const [result] = await db.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [newRole, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

export default User;