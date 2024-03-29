const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController'); // Adjust the path as necessary
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware is in a separate file

// Create a new recipe (Protected route)
router.post('/recipes', authenticate, recipesController.create);

// List all recipes
router.get('/recipes', recipesController.listAll);

// Get a single recipe by ID
router.get('/recipes/:id', recipesController.findById);

// Update a recipe (Protected route)
router.put('/recipes/:id', authenticate, recipesController.update);

// Delete a recipe (Protected route)
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
