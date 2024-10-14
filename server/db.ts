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
  socketPath: process.env.MYSQL_HOST, // Use the service name 'db' defined in docker-compose.yml PlantPalPassword123!
  user: process.env.MYSQL_USER || 'plantpal',
  password: process.env.MYSQL_PASSWORD || 'StrongPassword123!', // StrongPassword123!
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
    // create database if not exists
    await db.query('CREATE DATABASE IF NOT EXISTS plantpalDB');
    await db.query('USE plantpalDB');

    // create users table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Create plants table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plant_id VARCHAR(255), 
        plant_name VARCHAR(255) NOT NULL,
        watering_frequency VARCHAR(50) NOT NULL,
        latest_watered DATE NOT NULL,
        image_url VARCHAR(255),
        image_blob LONGBLOB,
        user_email VARCHAR(255),
        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
      );
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