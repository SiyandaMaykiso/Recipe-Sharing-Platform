const express = require('express');
const router = express.Router();
const multer = require('multer');
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create a recipe, require authentication
router.post('/recipes', authenticate, upload.single('recipeImage'), recipesController.create);

// List all recipes for the logged-in user
router.get('/recipes', authenticate, recipesController.listByUser);

// Get a specific recipe by ID (publicly accessible)
router.get('/recipes/:id', recipesController.findById);

// Update a recipe, require authentication
router.put('/recipes/:id', authenticate, upload.single('recipeImage'), recipesController.update);

// Delete a recipe, require authentication
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
