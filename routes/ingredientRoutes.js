const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsController'); 
const { authenticate } = require('../middleware/auth');

router.post('/recipes/:recipeId/ingredients', authenticate, ingredientsController.addIngredient);

router.put('/recipes/:recipeId/ingredients/:ingredientId', authenticate, ingredientsController.updateIngredient);

router.delete('/recipes/:recipeId/ingredients/:ingredientId', authenticate, ingredientsController.deleteIngredient);

router.get('/recipes/:recipeId/ingredients', ingredientsController.getIngredientsByRecipe);

module.exports = router;
