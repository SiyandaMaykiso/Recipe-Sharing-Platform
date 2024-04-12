const express = require('express');
const router = express.Router();
const multer = require('multer');
const recipesController = require('../controllers/recipesController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/recipes', authenticate, upload.single('recipeImage'), recipesController.create);

router.get('/recipes', recipesController.listAll);

router.get('/recipes/:id', recipesController.findById);

router.put('/recipes/:id', authenticate, upload.single('recipeImage'), (req, res, next) => {
   
    next();
}, recipesController.update);

router.delete('/recipes/:id', authenticate, recipesController.delete);

module.exports = router;
