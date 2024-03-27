// controllers/ingredientsController.js
const { Ingredient } = require('../models');

exports.createIngredient = async (req, res) => {
    const { name, quantity, recipeId } = req.body;
    try {
        const ingredient = await Ingredient.create({ name, quantity, recipeId });
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getIngredientById = async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findByPk(id);
        if (ingredient) {
            res.json(ingredient);
        } else {
            res.status(404).json({ message: "Ingredient not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateIngredient = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, recipeId } = req.body;
    try {
        const ingredient = await Ingredient.findByPk(id);
        if (ingredient) {
            await ingredient.update({ name, quantity, recipeId });
            res.json(ingredient);
        } else {
            res.status(404).json({ message: "Ingredient not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteIngredient = async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findByPk(id);
        if (ingredient) {
            await ingredient.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Ingredient not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
