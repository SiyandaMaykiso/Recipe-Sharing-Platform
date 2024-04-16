const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');
const { parser } = require('../middleware/cloudinaryConfig');  // Importing Cloudinary parser from your configuration

// Create a recipe, require authentication and handle image upload via Cloudinary
router.post('/recipes', authenticate, parser.single('recipeImage'), recipesController.create);

// List all recipes for the logged-in user
router.get('/recipes', authenticate, recipesController.listByUser);

// Get a specific recipe by ID (publicly accessible)
router.get('/recipes/:id', recipesController.findById);

// Update a recipe, require authentication and handle image update via Cloudinary
router.put('/recipes/:id', authenticate, parser.single('recipeImage'), recipesController.update);

// Delete a recipe, require authentication
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
