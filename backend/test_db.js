require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Open') as open,
        COUNT(*) FILTER (WHERE status = 'In Progress') as "inProgress",
        COUNT(*) FILTER (WHERE status = 'Resolved') as resolved
      FROM tickets
    `);
    console.log(rows);
  } catch (err) {
    console.error('ERROR MESSAGE:', err.message);
  } finally {
    pool.end();
  }
}
test();
