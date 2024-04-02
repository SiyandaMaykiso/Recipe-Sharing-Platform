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

  async findById(userId) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const values = [userId];
    try {
      const { rows } = await db.query(query, values);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  async update(userId, { username, email }) {
    const query = 'UPDATE Users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *';
    const values = [username, email, userId];
    try {
      const { rows } = await db.query(query, values);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async delete(userId) {
    const query = 'DELETE FROM Users WHERE user_id = $1';
    const values = [userId];
    try {
      await db.query(query, values);
      // No return value needed as deletion does not return a row
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

module.exports = User;
