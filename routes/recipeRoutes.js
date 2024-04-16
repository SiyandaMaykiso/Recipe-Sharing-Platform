const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');
// Import the specific recipeParser from your Cloudinary configuration
const { recipeParser } = require('../middleware/cloudinaryConfig');  // Make sure this matches the exported name

// Create a recipe, require authentication and handle image upload via Cloudinary
router.post('/recipes', authenticate, recipeParser.single('recipeImage'), recipesController.create);

// List all recipes for the logged-in user
router.get('/recipes', authenticate, recipesController.listByUser);

// Get a specific recipe by ID (publicly accessible)
router.get('/recipes/:id', recipesController.findById);

// Update a recipe, require authentication and handle image update via Cloudinary
router.put('/recipes/:id', authenticate, recipeParser.single('recipeImage'), recipesController.update);

// Delete a recipe, require authentication
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
