const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticate } = require('../middleware/auth');

router.post('/recipes/:recipeId/comments', authenticate, commentsController.postComment);

router.put('/comments/:commentId', authenticate, commentsController.updateComment);

router.delete('/comments/:commentId', authenticate, commentsController.deleteComment);

router.get('/recipes/:recipeId/comments', commentsController.getCommentsByRecipe);

module.exports = router;
