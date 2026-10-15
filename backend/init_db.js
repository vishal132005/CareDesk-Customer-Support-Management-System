require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSchema() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('Schema created successfully.');
  } catch (err) {
    console.error('Failed to create schema:', err);
  } finally {
    pool.end();
  }
}
runSchema();
