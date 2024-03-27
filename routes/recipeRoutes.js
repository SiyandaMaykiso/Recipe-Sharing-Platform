// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware set up
const recipesController = require('../controllers/recipesController');

// Apply the authMiddleware to routes that modify data
router.post('/', authMiddleware, recipesController.createRecipe); // Create a new recipe
router.get('/', recipesController.getAllRecipes); // Get all recipes - No auth required for reading
router.get('/:id', recipesController.getRecipeById); // Get a single recipe by id - No auth required for reading
router.put('/:id', authMiddleware, recipesController.updateRecipe); // Update a recipe by id
router.delete('/:id', authMiddleware, recipesController.deleteRecipe); // Delete a recipe by id

module.exports = router;
