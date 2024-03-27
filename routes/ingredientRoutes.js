// routes/ingredientRoutes.js
const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredientsController');

router.post('/', ingredientsController.createIngredient);
router.get('/', ingredientsController.getAllIngredients);
router.get('/:id', ingredientsController.getIngredientById);
router.put('/:id', ingredientsController.updateIngredient);
router.delete('/:id', ingredientsController.deleteIngredient);

module.exports = router;
