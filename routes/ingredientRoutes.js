const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsController'); // Adjust the path as necessary
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware is in a separate file

// Adjust the route for adding a new ingredient to include the recipeId
router.post('/recipes/:recipeId/ingredients', authenticate, ingredientsController.addIngredient);

// Updating an existing ingredient (protected)
router.put('/recipes/:recipeId/ingredients/:ingredientId', authenticate, ingredientsController.updateIngredient);

// Deleting an ingredient (protected)
router.delete('/recipes/:recipeId/ingredients/:ingredientId', authenticate, ingredientsController.deleteIngredient);

// Getting all ingredients for a specific recipe
router.get('/recipes/:recipeId/ingredients', ingredientsController.getIngredientsByRecipe);

module.exports = router;
