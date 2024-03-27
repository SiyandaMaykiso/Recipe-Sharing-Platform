// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the authentication middleware
const commentsController = require('../controllers/commentsController');

// Apply the authMiddleware to routes that modify data
router.post('/', authMiddleware, commentsController.createComment); // Secure create operation
router.get('/', commentsController.getAllComments); // Publicly accessible
router.get('/:id', commentsController.getCommentById); // Publicly accessible
router.put('/:id', authMiddleware, commentsController.updateComment); // Secure update operation
router.delete('/:id', authMiddleware, commentsController.deleteComment); // Secure delete operation

module.exports = router;
