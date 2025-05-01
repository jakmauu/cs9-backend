const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tes koneksi
pool.connect()
  .then(() => console.log('Connected to PostgreSQL Neon database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

module.exports = pool;