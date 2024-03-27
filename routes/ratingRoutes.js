// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the authentication middleware
const ratingsController = require('../controllers/ratingsController');

// Apply the authMiddleware to routes that modify data
router.post('/', authMiddleware, ratingsController.createRating); // Secure create operation
router.get('/', ratingsController.getAllRatings); // Publicly accessible
router.get('/:id', ratingsController.getRatingById); // Publicly accessible
router.put('/:id', authMiddleware, ratingsController.updateRating); // Secure update operation
router.delete('/:id', authMiddleware, ratingsController.deleteRating); // Secure delete operation

module.exports = router;
