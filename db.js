const { Pool } = require('pg');

// Determine SSL usage based on environment
const useSSL = process.env.NODE_ENV === 'production'; // Use SSL only in production
const sslConfig = useSSL ? {
  rejectUnauthorized: false, // Required to avoid unauthorized issues on Heroku
} : null; // No SSL config for non-production environments

console.log("Database connection settings:");
console.log("SSL Config Active:", useSSL);  // Indicates whether SSL is being used
console.log("SSL Detailed Config:", JSON.stringify(sslConfig));  // Shows detailed SSL config or null
console.log("Using DATABASE_URL from environment:", !!process.env.DATABASE_URL);  // Simplified boolean check

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig
});

pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => {
    console.log('Executing query:', text);
    return pool.query(text, params).then(result => {
      console.log('Query successful:', text);
      return result;
    }).catch(err => {
      console.error('Query failed:', text, err);
      throw err;
    });
  }
};
