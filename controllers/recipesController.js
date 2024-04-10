const Recipe = require('../models/recipe'); // Adjust the path as necessary

exports.create = async (req, res) => {
    try {
        const { title, description, ingredients, instructions } = req.body;
        const user_id = parseInt(req.body.user_id);
        const imagePath = req.file ? req.file.path : '';

        // No need to parse ingredients and instructions since they are strings
        const recipe = await Recipe.create({
            userId: user_id,
            title,
            description,
            ingredients, // Directly passed as strings
            instructions, // Directly passed as strings
            imagePath,
        });

        return res.status(201).json({ message: 'Recipe created successfully', recipe });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return res.status(500).json({ message: 'Error creating recipe', error: error.toString() });
    }
};

// List all recipes
exports.listAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error retrieving recipes:', error);
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
        console.error('Error retrieving recipe:', error.stack); // Enhanced error logging
        res.status(500).json({ message: 'Error retrieving recipe', error: error.message });
    }
};

// Update a recipe
exports.update = async (req, res) => {
    console.log("req.file:", req.file); // Log to see if the file is being received
    const { id } = req.params;
    const { title, description, ingredients, instructions } = req.body;
    let updateData = { title, description, ingredients, instructions };

    if (req.file) {
        const imagePath = req.file.path; // Only update imagePath if a new file is uploaded
        updateData.imagePath = imagePath;
    }

    try {
        const recipeId = parseInt(id);
        const updatedRecipe = await Recipe.update(recipeId, updateData);
        if (updatedRecipe) {
            res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};


// Delete a recipe
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Recipe.delete(id);
        if (result) {
            res.status(204).send(); // No content to send back for a successful deletion
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error.stack); // Enhanced error logging
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};

module.exports = exports;
