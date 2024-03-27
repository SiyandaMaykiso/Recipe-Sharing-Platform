// controllers/recipesController.js
const { Recipe } = require('../models');

exports.createRecipe = async (req, res) => {
    // Logic to create a recipe
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getRecipeById = async (req, res) => {
    // Logic to get a single recipe by id
};

exports.updateRecipe = async (req, res) => {
    // Logic to update a recipe by id
};

exports.deleteRecipe = async (req, res) => {
    // Logic to delete a recipe by id
};
