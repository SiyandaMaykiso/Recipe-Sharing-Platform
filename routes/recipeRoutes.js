const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');

const { recipeParser } = require('../middleware/cloudinaryConfig'); 


router.post('/recipes', authenticate, recipeParser.single('recipeImage'), recipesController.create);


router.get('/recipes', recipesController.listByUser);


router.get('/recipes/:id', recipesController.findById);


router.put('/recipes/:id', authenticate, recipeParser.single('recipeImage'), recipesController.update);


router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
