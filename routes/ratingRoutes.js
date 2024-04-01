const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController'); // Adjust the path as necessary
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware is in a separate file

// Add a new rating (protected)
router.post('/recipes/:recipeId/ratings', authenticate, ratingsController.addRating);

// Update a rating (protected)
router.put('/recipes/:recipeId/ratings/:ratingId', authenticate, ratingsController.updateRating);

// Get ratings for a recipe
router.get('/recipes/:recipeId/ratings', ratingsController.getRatingsByRecipe);

module.exports = router;
