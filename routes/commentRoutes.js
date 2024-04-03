const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController'); // Adjust the path as necessary
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware is in a separate file

// Post a new comment (protected)
router.post('/recipes/:recipeId/comments', authenticate, commentsController.postComment);

// Update an existing comment (protected)
router.put('/comments/:commentId', authenticate, commentsController.updateComment);

// Delete a comment (protected)
router.delete('/comments/:commentId', authenticate, commentsController.deleteComment);

// Get all comments for a specific recipe
router.get('/recipes/:recipeId/comments', commentsController.getCommentsByRecipe);

module.exports = router;
