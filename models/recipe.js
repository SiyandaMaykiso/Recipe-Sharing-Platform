const db = require('../db'); // Adjust path as necessary

const Recipe = {
  async create({ userId, title, description, ingredients, instructions, imagePath }) {
    const query = `
      INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_path, creation_date)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    // Directly use ingredients and instructions as strings
    const values = [userId, title, description, ingredients, instructions, imagePath];

    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating recipe:', error);
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

  async update(recipeId, { title, description, ingredients, instructions, imagePath }) {
    const query = `
      UPDATE Recipes
      SET title = $2, description = $3, ingredients = $4, instructions = $5, image_path = $6
      WHERE recipe_id = $1
      RETURNING *;
    `;
    const values = [recipeId, title, description, ingredients, instructions, imagePath];

    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) throw new Error('Recipe not found or not updated');
      return rows[0];
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  },

  async delete(recipeId) {
    const query = 'DELETE FROM Recipes WHERE recipe_id = $1 RETURNING *;';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        return false; // No rows affected, recipe not found
      }
      return true; // Recipe found and deleted
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
};

module.exports = Recipe;
