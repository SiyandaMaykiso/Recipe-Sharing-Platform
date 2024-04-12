const Ingredient = require('../models/ingredient');

exports.addIngredient = async (req, res) => {
    const { recipeId } = req.params; 
    const { name, quantity } = req.body;
    try {
        const newIngredient = await Ingredient.create({ recipeId, name, quantity });
        res.status(201).json({ message: 'Ingredient added successfully', ingredient: newIngredient });
    } catch (error) {
        res.status(500).json({ message: 'Error adding ingredient', error: error.message });
    }
};

exports.updateIngredient = async (req, res) => {
    const { ingredientId } = req.params;
    const { name, quantity } = req.body;
    try {
        const updatedIngredient = await Ingredient.update(ingredientId, { name, quantity });
        if (updatedIngredient) {
            res.status(200).json({ message: 'Ingredient updated successfully', ingredient: updatedIngredient });
        } else {
            res.status(404).json({ message: 'Ingredient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating ingredient', error: error.message });
    }
};

exports.deleteIngredient = async (req, res) => {
    const { ingredientId } = req.params;
    try {
        await Ingredient.delete(ingredientId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ingredient', error: error.message });
    }
};

exports.getIngredientsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    try {
        const ingredients = await Ingredient.findByRecipeId(recipeId);
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ingredients', error: error.message });
    }
};
