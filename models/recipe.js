const db = require('../db');

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
    const values = [parseInt(recipeId, 10)];

    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error finding recipe:', error);
      throw error;
    }
  },

  async update(recipeId, { title, description, ingredients, instructions, imagePath }) {
    const id = parseInt(recipeId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid recipe ID');
    }
  
    const exists = await this.findById(id);
    if (!exists) {
      throw new Error('Recipe not found');
    }
  
    const updateData = { title, description, ingredients, instructions, image_path: imagePath };
  
    const setClause = Object.entries(updateData)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value], index) => `${key} = $${index + 2}`)
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
    const id = parseInt(recipeId, 10);
    const query = 'DELETE FROM recipes WHERE recipe_id = $1 RETURNING *;';
    const values = [id];

    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM recipes WHERE user_id = $1 ORDER BY creation_date DESC';
    const values = [userId];

    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error finding recipes by user ID:', error);
      throw error;
    }
  },
};

module.exports = Recipe;
