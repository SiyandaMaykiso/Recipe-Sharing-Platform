const db = require('../db'); // Ensure the path is correct based on your project structure

const Recipe = {
  async create({ userId, title, description, imagePath, creationDate = new Date() }) {
    const formattedCreationDate = creationDate instanceof Date ? creationDate.toISOString().split('T')[0] : creationDate;
    const query = `
      INSERT INTO Recipes (user_id, title, description, image_path, creation_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, title, description, imagePath, formattedCreationDate];
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

  async update(recipeId, { title, description, imagePath }) {
    // Ensure imagePath is included only if provided, to avoid overwriting existing images with null
    const queryParams = [];
    const queryValues = [];

    let query = 'UPDATE Recipes SET ';

    if (title) {
      queryParams.push(`title = $${queryParams.length + 1}`);
      queryValues.push(title);
    }

    if (description) {
      queryParams.push(`description = $${queryParams.length + 1}`);
      queryValues.push(description);
    }

    if (imagePath) {
      queryParams.push(`image_path = $${queryParams.length + 1}`);
      queryValues.push(imagePath);
    }

    query += queryParams.join(', ') + ` WHERE recipe_id = $${queryParams.length + 1} RETURNING *;`;
    queryValues.push(recipeId);

    try {
      const { rows } = await db.query(query, queryValues);
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

  // Additional methods as needed...
};

module.exports = Recipe;
