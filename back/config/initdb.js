import db from "./db.js";
import 'dotenv/config.js';

const queries = [
    `USE ${process.env.DB_NAME};`, //well

    `-- 1. USERS TABLE (Handles Admin, Farmers, and Buyers)
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'farmer', 'buyer') NOT NULL DEFAULT 'farmer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,

    `INSERT IGNORE INTO users (name, email, password_hash, role) VALUES ('Nkamushaba Prove', 'admin@farm.ac.ug', '$2b$10$2XEu3F1bp80Ii6rIC.mnHecNuzY6ud0w4GVt7i8NKinIlF786AoXm', 'admin');`,

    `-- 2. FIELDS TABLE (Managed by Farmers, Monitored by Admin)
    CREATE TABLE IF NOT EXISTS fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        size_hectares DECIMAL(5, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `-- 3. CROPS TABLE (What is being grown in the fields)
    CREATE TABLE IF NOT EXISTS crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        field_id INT NOT NULL,
        crop_type VARCHAR(100) NOT NULL, -- e.g., Maize, Tomatoes, Wheat
        status ENUM('planted', 'growing', 'harvested') DEFAULT 'planted',
        planted_at DATE NOT NULL,
        harvested_at DATE NULL,
        FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_id INT NOT NULL,
        buyer_id INT NOT NULL,
        offer_price DECIMAL(10, 2) NOT NULL,
        quantity_kg DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS farmer_profiles (
        user_id INT PRIMARY KEY,
        farm_name VARCHAR(150) NOT NULL,
        contact_phone VARCHAR(30) NULL,
        shipping_hub VARCHAR(100) DEFAULT 'Central Logistics Node',
        bio TEXT NULL,
        profile_pic VARCHAR(255) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS system_settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value VARCHAR(100) NOT NULL,
        description TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );`,

    `-- Seed initial global operational variables
    INSERT IGNORE INTO system_settings (setting_key, setting_value, description) VALUES
    ('marketplace_fee_percent', '1.5', 'Global transaction fee percentage charged on completed B2B contract sales.'),
    ('lowball_alert_percent', '20', 'The percentage deviation below market baseline price that triggers a lowball alert badge.'),
    ('require_registration_approval', 'false', 'Flag forcing manual admin review before newly registered profiles can post or buy.');`,

    `CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(50) NOT NULL, -- e.g., 'USER_SUSPENDED', 'PROFILE_MODIFIED'
    description TEXT NOT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);`,

];

const initDataBase = async ()=>{
    try {
        console.log('----- ⚙ Initializing DataBase Tables ⚙ -----');
        //execute queries squentially to preserve Foreign key dependencies
        for(const query of queries){
            await db.query(query);
        }
        console.log('✔ db conneted successfully...');
    } catch (error) {
        console.error('db initialized failed ❌.', error.message);
        process.exit(1);//stop the server if database setup fails
    }
}

export default initDataBase;