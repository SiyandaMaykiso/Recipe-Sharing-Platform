const db = require('../db');

const Ingredient = {
  
  async create({ recipeId, name, quantity }) {
    const query = `
      INSERT INTO Ingredients (recipe_id, name, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [recipeId, name, quantity];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error adding ingredient', error);
      throw error;
    }
  },


  async findByRecipeId(recipeId) {
    const query = 'SELECT * FROM Ingredients WHERE recipe_id = $1';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error finding ingredients for recipe', error);
      throw error;
    }
  },

  async update(ingredientId, { name, quantity }) {
    const query = `
      UPDATE Ingredients
      SET name = $2, quantity = $3
      WHERE ingredient_id = $1
      RETURNING *;
    `;
    const values = [ingredientId, name, quantity];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Ingredient not found or not updated');
      }
      return rows[0];
    } catch (error) {
      console.error('Error updating ingredient', error);
      throw error;
    }
  },

  async delete(ingredientId) {
    const query = 'DELETE FROM Ingredients WHERE ingredient_id = $1 RETURNING *;';
    const values = [ingredientId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Ingredient not found or not deleted');
      }
      return rows[0];
    } catch (error) {
      console.error('Error deleting ingredient', error);
      throw error;
    }
  },

};

module.exports = Ingredient;
