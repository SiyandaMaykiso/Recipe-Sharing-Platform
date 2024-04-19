const db = require('../db');
const bcrypt = require('bcryptjs');  // Make sure bcryptjs is imported

const User = {
  async create(username, email, password) {
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);  // Log hashed password for debug

    const query = 'INSERT INTO Users(username, email, password) VALUES($1, $2, $3) RETURNING *';
    const values = [username, email, hashedPassword];
    try {
      const { rows } = await db.query(query, values);
      console.log("New user created:", rows[0]);  // Log newly created user info
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
      console.log("Executing findByEmail with email:", email);  // Log the email being used in the query
      const { rows } = await db.query(query, values);
      if (rows.length > 0) {
        console.log("User found by email:", rows[0]);  // Log user data found by email
      } else {
        console.log("No user found for email:", email);  // Log when no user is found
      }
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
      if (rows.length > 0) {
        console.log("User found by ID:", rows[0]);  // Log user data found by ID
      }
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  async update(userId, updateFields) {
    const fieldsToUpdate = Object.entries(updateFields).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    let query = 'UPDATE Users SET ';
    const queryParams = [];
    const queryParts = [];

    Object.keys(fieldsToUpdate).forEach((field, index) => {
      const columnName = field === 'profileImagePath' ? 'profile_image_path' : field;
      queryParts.push(`${columnName} = $${index + 1}`);
      queryParams.push(fieldsToUpdate[field]);
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
