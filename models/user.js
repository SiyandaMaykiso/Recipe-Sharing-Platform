const db = require('../db'); // Ensure the path is correctly adjusted to your project structure

const User = {
  async create(username, email, password) {
    const query = 'INSERT INTO Users(username, email, password) VALUES($1, $2, $3) RETURNING *';
    const values = [username, email, password];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
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
      console.error('Error finding user by email:', error);
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
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  async update(userId, updateFields) {
    let query = 'UPDATE Users SET ';
    const queryParams = [];
    const queryParts = [];

    Object.keys(updateFields).forEach((field, index) => {
      queryParts.push(`${field} = $${index + 1}`);
      queryParams.push(updateFields[field]);
    });

    query += queryParts.join(', ') + ' WHERE user_id = $' + (queryParams.length + 1) + ' RETURNING *';
    queryParams.push(userId);

    try {
      const { rows } = await db.query(query, queryParams);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async delete(userId) {
    const query = 'DELETE FROM Users WHERE user_id = $1 RETURNING *';
    const values = [userId];
    try {
      const { rows } = await db.query(query, values);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

module.exports = User;
