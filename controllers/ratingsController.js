// controllers/ratingsController.js
const { Rating } = require('../models');

// Create a new rating
exports.createRating = async (req, res) => {
    const { userId, recipeId, rating } = req.body;
    try {
        const newRating = await Rating.create({ userId, recipeId, rating });
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ message: "Error creating rating", error: error.message });
    }
};

// Fetch all ratings
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.findAll();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ratings", error: error.message });
    }
};

// Fetch a single rating by ID
exports.getRatingById = async (req, res) => {
    const { id } = req.params;
    try {
        const rating = await Rating.findByPk(id);
        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rating", error: error.message });
    }
};

// Update a rating by ID
exports.updateRating = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const [updated] = await Rating.update({ rating }, { where: { id } });
        if (updated) {
            const updatedRating = await Rating.findByPk(id);
            res.json(updatedRating);
        } else {
            res.status(404).json({ message: "Rating not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating rating", error: error.message });
    }
};

// Delete a rating by ID
exports.deleteRating = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Rating.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Rating not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting rating", error: error.message });
    }
};
