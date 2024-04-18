const { Pool } = require('pg');

// Determine SSL usage based on environment
const useSSL = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? {
    rejectUnauthorized: false // This is important to avoid "self-signed certificate" issues
  } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
