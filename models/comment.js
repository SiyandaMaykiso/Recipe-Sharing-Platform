const db = require('../db'); // Adjust the path as necessary for your project structure

const Comment = {
  // Add a new comment to a recipe
  async create({ recipeId, userId, commentText }) {
    const query = `
      INSERT INTO Comments (recipe_id, user_id, comment_text, comment_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const values = [recipeId, userId, commentText];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error adding comment', error);
      throw error;
    }
  },

  // Get all comments for a recipe
  async findByRecipeId(recipeId) {
    const query = 'SELECT * FROM Comments WHERE recipe_id = $1 ORDER BY comment_date DESC';
    const values = [recipeId];
    try {
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error('Error finding comments for recipe', error);
      throw error;
    }
  },

  // Update a comment
  async update(commentId, { commentText }) {
    const query = `
      UPDATE Comments
      SET comment_text = $2, comment_date = NOW()
      WHERE comment_id = $1
      RETURNING *;
    `;
    const values = [commentId, commentText];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Comment not found or not updated');
      }
      return rows[0];
    } catch (error) {
      console.error('Error updating comment', error);
      throw error;
    }
  },

  // Delete a comment
  async delete(commentId) {
    const query = 'DELETE FROM Comments WHERE comment_id = $1 RETURNING *;';
    const values = [commentId];
    try {
      const { rows } = await db.query(query, values);
      if (!rows.length) {
        throw new Error('Comment not found or not deleted');
      }
      return rows[0];
    } catch (error) {
      console.error('Error deleting comment', error);
      throw error;
    }
  },

  // Additional methods as needed...
};

module.exports = Comment;
