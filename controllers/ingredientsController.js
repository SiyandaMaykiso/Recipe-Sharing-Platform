const Ingredient = require('../models/ingredient'); // Adjust the path as necessary

// Add a new ingredient to a recipe
exports.addIngredient = async (req, res) => {
    const { recipeId } = req.params; // Extracting recipeId from URL parameters
    const { name, quantity } = req.body; // Assume these are provided in the request
    try {
        const newIngredient = await Ingredient.create({ recipeId, name, quantity });
        res.status(201).json({ message: 'Ingredient added successfully', ingredient: newIngredient });
    } catch (error) {
        res.status(500).json({ message: 'Error adding ingredient', error: error.message });
    }
};

// Update an existing ingredient
exports.updateIngredient = async (req, res) => {
    const { ingredientId } = req.params;
    const { name, quantity } = req.body; // Assume these are the fields to update
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

// Delete an ingredient
exports.deleteIngredient = async (req, res) => {
    const { ingredientId } = req.params;
    try {
        await Ingredient.delete(ingredientId);
        res.status(204).send(); // No content to send back upon successful deletion
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ingredient', error: error.message });
    }
};

// Get all ingredients for a recipe
exports.getIngredientsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    try {
        const ingredients = await Ingredient.findByRecipeId(recipeId);
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ingredients', error: error.message });
    }
};
