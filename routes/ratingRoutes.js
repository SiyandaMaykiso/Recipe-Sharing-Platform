const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');
const { authenticate } = require('../middleware/auth');

router.post('/recipes/:recipeId/ratings', authenticate, ratingsController.addRating);

router.put('/ratings/:ratingId', authenticate, ratingsController.updateRating);

router.get('/recipes/:recipeId/ratings', ratingsController.getRatingsByRecipe);



module.exports = router;
