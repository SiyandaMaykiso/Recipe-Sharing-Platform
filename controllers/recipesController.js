// controllers/recipesController.js
const { Recipe } = require('../models');

// Logic to create a recipe
exports.createRecipe = async (req, res) => {
    const { userId, title, description, creationDate } = req.body;
    try {
        const recipe = await Recipe.create({ userId, title, description, creationDate });
        res.status(201).json(recipe);
    } catch (error) {
        console.error("Error creating recipe: ", error);
        res.status(500).json({ message: "Error creating new recipe", error: error.message });
    }
};

// Logic to get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Logic to get a single recipe by id
exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (error) {
        console.error("Error fetching recipe by ID: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Logic to update a recipe by id
exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { title, description, creationDate } = req.body;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            await recipe.update({ title, description, creationDate });
            res.json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (error) {
        console.error("Error updating recipe: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Logic to delete a recipe by id
exports.deleteRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const recipe = await Recipe.findByPk(id);
        if (recipe) {
            await recipe.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (error) {
        console.error("Error deleting recipe: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
