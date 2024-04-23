const Recipe = require('../models/recipe');

exports.create = async (req, res) => {
    console.log("Received JWT decoded data:", req.user);
    const { title, description, ingredients, instructions } = req.body;
    const userId = req.user.id;
    console.log("User ID from JWT:", userId);

    if (!userId) {
        console.error("User ID is missing");
        return res.status(400).json({ message: "User ID is required" });
    }

    const imagePath = req.file ? req.file.path : undefined;
    try {
        const recipe = await Recipe.create({
            userId,
            title,
            description,
            ingredients,
            instructions,
            imagePath,
        });

        return res.status(201).json({ message: 'Recipe created successfully', recipe });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return res.status(500).json({ message: 'Error creating recipe', error: error.toString() });
    }
};

exports.listByUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log("Listing recipes for user ID:", userId);
        const recipes = await Recipe.findByUserId(userId);
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error retrieving recipes:', error);
        res.status(500).json({ message: 'Error retrieving recipes', error: error.message });
    }
};


eexports.listByUser = (req, res) => {
    // Fetch all recipes available publicly
    Recipe.findAll()
        .then(recipes => {
            res.json(recipes);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving recipes." });
        });
};


exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, ingredients, instructions } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const updatedRecipe = await Recipe.update(id, {
            title,
            description,
            ingredients,
            instructions,
            imagePath
        });
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

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Recipe.delete(id);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};

module.exports = exports;
