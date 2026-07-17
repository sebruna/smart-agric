import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements:true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : (process.env.NODE_ENV === 'production' ? {} : false),
});

console.log("💾 MySQL Database Connection Pool initialized.");
export default db.promise();