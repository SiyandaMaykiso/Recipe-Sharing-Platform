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

  async update(userId, { username, email }) {
    const query = `
      UPDATE Users
      SET username = $1, email = $2
      WHERE user_id = $3
      RETURNING *;
    `;
    const values = [username, email, userId];
    try {
      const { rows } = await db.query(query, values);
      if (rows.length > 0) {
        return rows[0]; // Assuming IDs are unique, there should only be one row for the updated user
      } else {
        return null; // No user found with this ID, or no update was made
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // You can add more methods as needed for your user management
};

module.exports = User;
