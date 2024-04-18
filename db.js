const { Pool } = require('pg');

// Determine SSL usage based on environment
const useSSL = process.env.NODE_ENV === 'production';
const sslConfig = useSSL ? { rejectUnauthorized: false } : false;

console.log("Database connection settings:");
console.log("SSL Config:", sslConfig);
console.log("Using DATABASE_URL from environment:", Boolean(process.env.DATABASE_URL));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
