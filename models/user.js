const db = require('../db'); // Adjust the path based on your project structure

const User = {
  async create(username, email, password) {
    const query = 'INSERT INTO Users(username, email, password) VALUES($1, $2, $3) RETURNING *';
    const values = [username, email, password];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const values = [email];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Add more methods as needed
};

module.exports = User;
