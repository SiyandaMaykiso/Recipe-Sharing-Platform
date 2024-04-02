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
      if (rows.length > 0) {
        return rows[0];
      } else {
        return null; // No user found with this email
      }
    } catch (error) {
      throw error;
    }
  },

  // Method to find a user by their ID
  async findById(userId) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const values = [userId];
    try {
      const { rows } = await db.query(query, values);
      if (rows.length > 0) {
        return rows[0]; // Return the user found
      } else {
        return null; // No user found with this ID
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Add more methods as needed
};

module.exports = User;
