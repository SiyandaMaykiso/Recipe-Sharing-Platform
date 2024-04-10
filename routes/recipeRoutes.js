const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import Multer
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');
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
router.put('/recipes/:id', authenticate, upload.single('recipeImage'), (req, res, next) => {
    // No need to handle Multer errors here, as they are already handled by the middleware
    next();
}, recipesController.update);

// Delete a recipe (Protected route)
router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
