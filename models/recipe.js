const db = require('../db'); // Adjust path as necessary

const Recipe = {
  async create({ userId, title, description, ingredients, instructions, imagePath }) {
    const query = `
      INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_path, creation_date)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
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
    const query = 'SELECT * FROM recipes WHERE recipe_id = $1';
    const values = [parseInt(recipeId, 10)]; // Ensure recipeId is an integer

    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) {
        return null; // Return null if recipe is not found
      }
      return rows[0];
    } catch (error) {
      console.error('Error finding recipe:', error);
      throw error;
    }
  },

  async update(recipeId, { title, description, ingredients, instructions, imagePath }) {
    const id = parseInt(recipeId, 10); // Ensure recipeId is an integer
    if (isNaN(id)) {
      throw new Error('Invalid recipe ID');
    }
  
    // Verify the recipe exists before attempting to update
    const exists = await this.findById(id);
    if (!exists) {
      throw new Error('Recipe not found');
    }
  
    const updateData = { title, description, ingredients, instructions, image_path: imagePath };
  
    // Construct SET clause dynamically based on non-undefined values in updateData
    const setClause = Object.entries(updateData)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value], index) => `${key} = $${index + 2}`) // Start index at $2 for id
      .join(', ');
  
    const query = `
      UPDATE recipes
      SET ${setClause}
      WHERE recipe_id = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(updateData).filter(value => value !== undefined)];
  
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
    const id = parseInt(recipeId, 10); // Ensure recipeId is an integer
    const query = 'DELETE FROM recipes WHERE recipe_id = $1 RETURNING *;';
    const values = [id];

    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) {
        return false; // Recipe not found or not deleted
      }
      return true; // Recipe deleted
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },

  async findAll({ userId } = {}) {
    let query = 'SELECT * FROM recipes';
    const values = [];

    if (userId) {
      query += ' WHERE user_id = $1';
      values.push(parseInt(userId, 10)); // Ensure userId is an integer
    }

    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error listing recipes:', error);
      throw error;
    }
  },
};

module.exports = Recipe;
