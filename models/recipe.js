const db = require('../db'); // Ensure the path is correct based on your project structure

const Recipe = {
  // Adjusted Create a new recipe method to handle creationDate automatically
  async create({ userId, title, description, creationDate = new Date() }) {
    // Automatically sets creationDate to current date if not provided
    // Ensure the date is formatted to YYYY-MM-DD for PostgreSQL compatibility
    const formattedCreationDate = creationDate instanceof Date ? creationDate.toISOString().split('T')[0] : creationDate;

    const query = `
      INSERT INTO Recipes (user_id, title, description, creation_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, title, description, formattedCreationDate];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating recipe', error);
      throw error;
    }
  },

  async findById(recipeId) {
    const query = 'SELECT * FROM Recipes WHERE recipe_id = $1';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Recipe not found');
      }
      return rows[0];
    } catch (error) {
      console.error('Error finding recipe', error);
      throw error;
    }
  },

  async update(recipeId, { title, description }) {
    const query = `
      UPDATE Recipes
      SET title = $2, description = $3
      WHERE recipe_id = $1
      RETURNING *;
    `;
    const values = [recipeId, title, description];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Recipe not found or not updated');
      }
      return rows[0];
    } catch (error) {
      console.error('Error updating recipe', error);
      throw error;
    }
  },

  async delete(recipeId) {
    const query = 'DELETE FROM Recipes WHERE recipe_id = $1 RETURNING *;';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Recipe not found or not deleted');
      }
      return rows[0];
    } catch (error) {
      console.error('Error deleting recipe', error);
      throw error;
    }
  },

  async findAll({ userId } = {}) {
    let query = 'SELECT * FROM Recipes';
    const values = [];

    if (userId) {
      query += ' WHERE user_id = $1';
      values.push(userId);
    }

    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error listing recipes', error);
      throw error;
    }
  },

  // Additional methods as needed...
};

module.exports = Recipe;
