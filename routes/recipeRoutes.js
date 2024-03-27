// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');

router.post('/', recipesController.createRecipe); // Create a new recipe
router.get('/', recipesController.getAllRecipes); // Get all recipes
router.get('/:id', recipesController.getRecipeById); // Get a single recipe by id
router.put('/:id', recipesController.updateRecipe); // Update a recipe by id
router.delete('/:id', recipesController.deleteRecipe); // Delete a recipe by id

module.exports = router;
