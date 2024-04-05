const Recipe = require('../models/recipe'); // Adjust the path as necessary

// Create a new recipe
exports.create = async (req, res) => {
    console.log("Request body:", req.body);
    const { user_id, title, description, creationDate } = req.body;
    // Extract the file information (if uploaded)
    console.log("Received user_id:", user_id);
    const imagePath = req.file ? req.file.path : null;

    // Validate required fields
    if (!user_id || !title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Include imagePath in the data to be saved
        const newRecipe = await Recipe.create({
            user_id, // Use the correct field name as expected by your database
            title,
            description,
            creationDate,
            imagePath
        });
        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        console.error('Error creating recipe:', error.stack); // Enhanced error logging
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

// List all recipes
exports.listAll = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error retrieving recipes:', error.stack); // Enhanced error logging
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
    const { id } = req.params;
    const { title, description } = req.body;
    // Extract the file information (if uploaded)
    const imagePath = req.file ? req.file.path : null;

    try {
        // Pass imagePath only if a new file is uploaded
        const updateData = imagePath ? { title, description, imagePath } : { title, description };

        const updatedRecipe = await Recipe.update(id, updateData);
        if (updatedRecipe) {
            res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error updating recipe:', error.stack); // Enhanced error logging
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
