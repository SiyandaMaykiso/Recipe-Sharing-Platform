// routes/ingredientRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware set up
const ingredientsController = require('../controllers/ingredientsController');

// Apply the authMiddleware to routes that modify data
router.post('/', authMiddleware, ingredientsController.createIngredient); // Create a new ingredient
router.get('/', ingredientsController.getAllIngredients); // Get all ingredients - No auth required for reading
router.get('/:id', ingredientsController.getIngredientById); // Get a single ingredient by id - No auth required for reading
router.put('/:id', authMiddleware, ingredientsController.updateIngredient); // Update an ingredient by id
router.delete('/:id', authMiddleware, ingredientsController.deleteIngredient); // Delete an ingredient by id

module.exports = router;
