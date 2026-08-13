const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'db_pertanian_peternakan',
  password: process.env.DB_PASSWORD || 'ervepe140604',
  port: process.env.DB_PORT || 5432,
});

const alter = async () => {
  try {
    await client.connect();
    // Add kelompok_tani column if it doesn't exist
    await client.query(`
      ALTER TABLE petani 
      ADD COLUMN IF NOT EXISTS kelompok_tani VARCHAR(150);
    `);
    console.log('Column kelompok_tani added successfully.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await client.end();
  }
};

alter();
