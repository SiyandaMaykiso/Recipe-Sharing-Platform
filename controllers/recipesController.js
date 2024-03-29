const Recipe = require('../models/recipe'); // Adjust the path as necessary

// Create a new recipe
exports.create = async (req, res) => {
    // Changed from 'userId' to 'user_id' to match expected payload key
    const { user_id, title, description, creationDate } = req.body; 
    try {
        // Adjusted to pass 'userId: user_id' to match the model's expectations
        const newRecipe = await Recipe.create({ userId: user_id, title, description, creationDate });
        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

// List all recipes
exports.listAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving recipes', error: error.message });
    }
};

// Get a single recipe by ID
exports.findById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findById(id);
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving recipe', error: error.message });
    }
};

// Update a recipe
exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body; // Assume these are the only fields to update
    try {
        const updatedRecipe = await Recipe.update(id, { title, description });
        res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};

// Delete a recipe
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await Recipe.delete(id);
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};
