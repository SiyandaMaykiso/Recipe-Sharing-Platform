const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController'); // Adjust the path as necessary
const { authenticate } = require('../middleware/auth'); // Assuming auth middleware is in a separate file
const upload = require('../middleware/upload'); // Import your Multer configuration

// Create a new recipe (Protected route)
// Note the addition of upload.single('recipeImage') middleware
// 'recipeImage' is the name attribute in your form
router.post('/recipes', authenticate, upload.single('recipeImage'), recipesController.create);

// List all recipes
router.get('/recipes', recipesController.listAll);

// Get a single recipe by ID
router.get('/recipes/:id', recipesController.findById);

// Update a recipe (Protected route)
// Applying Multer middleware for image upload on recipe update
router.put('/recipes/:id', authenticate, upload.single('recipeImage'), recipesController.update);

// Delete a recipe (Protected route)
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;