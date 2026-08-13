const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default DB
  password: 'ervepe140604',
  port: 5432,
});

const setup = async () => {
  try {
    await client.connect();
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'db_pertanian_peternakan'");
    if (res.rowCount === 0) {
      console.log('Database does not exist, creating...');
      await client.query('CREATE DATABASE db_pertanian_peternakan');
      console.log('Database created.');
    } else {
      console.log('Database already exists.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
};

setup();
