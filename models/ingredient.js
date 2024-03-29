const db = require('../db'); // Adjust the path based on your project structure

const Ingredient = {
  // Add a new ingredient to a recipe
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

  // Get all ingredients for a recipe
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

  // Update an ingredient
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

  // Delete an ingredient
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

  // Additional methods as needed...
};

module.exports = Ingredient;
