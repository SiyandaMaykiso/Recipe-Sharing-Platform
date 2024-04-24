const { Pool } = require('pg');


const useSSL = process.env.NODE_ENV === 'production';
const sslConfig = useSSL ? {
  rejectUnauthorized: false,
} : null;

console.log("Database connection settings:");
console.log("SSL Config Active:", useSSL); 
console.log("SSL Detailed Config:", JSON.stringify(sslConfig)); 
console.log("Using DATABASE_URL from environment:", !!process.env.DATABASE_URL); 

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
