/**
 * Database connection and query functions
 * @module db
 * @requires mysql2/promise
 * 
 * Init database sets up a table for users with email and password
 * If needed can create more tables
 */

import mysql from 'mysql2/promise';

// password StrongPassword123!
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '34.79.24.207', // Use the service name 'db' defined in docker-compose.yml PlantPalPassword123!
  user: process.env.MYSQL_USER || 'plantpal',
  port: 3306,
  password: process.env.MYSQL_PASSWORD || 'PlantPalPassword123!', // StrongPassword123!
  database: process.env.MYSQL_DATABASE || 'plantpalDB',
});

export async function query(sql: string, values?: any) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}

// Init database schema
export async function initializeDatabase() {
  const db = await pool.getConnection();
  try {
    await db.query('CREATE DATABASE IF NOT EXISTS plantpalDB');
    await db.query('USE plantpalDB');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    db.release();
  }
}

// Initialize the database when the module is loaded
initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
});

export default pool;