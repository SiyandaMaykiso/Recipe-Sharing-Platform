const db = require('../db'); // Ensure the path is correctly adjusted to your project structure

const Rating = {
  // Add a new rating to a recipe by a user
  async create({ recipeId, userId, rating }) {
    const query = `
      INSERT INTO Ratings (recipe_id, user_id, rating, rating_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [recipeId, userId, rating];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error adding rating', error);
      throw error;
    }
  },

  // Get all ratings for a recipe
  async findByRecipeId(recipeId) {
    const query = 'SELECT * FROM Ratings WHERE recipe_id = $1';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error finding ratings for recipe', error);
      throw error;
    }
  },

  // Update a rating
  async update(ratingId, { rating }) {
    const query = `
      UPDATE Ratings
      SET rating = $2, rating_date = NOW()
      WHERE rating_id = $1
      RETURNING *;
    `;
    const values = [ratingId, rating];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Rating not found or not updated');
      }
      return rows[0];
    } catch (error) {
      console.error('Error updating rating', error);
      throw error;
    }
  },

  // Delete a rating
  async delete(ratingId) {
    const query = 'DELETE FROM Ratings WHERE rating_id = $1 RETURNING *;';
    const values = [ratingId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Rating not found or not deleted');
      }
      return rows[0];
    } catch (error) {
      console.error('Error deleting rating', error);
      throw error;
    }
  },

  // Additional methods as needed...
};

module.exports = Rating;
