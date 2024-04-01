const Rating = require('../models/rating'); // Adjust the path as necessary

// Add a new rating
exports.addRating = async (req, res) => {
    const { recipeId } = req.params; // Extracting recipeId from URL parameters
    const { userId, rating } = req.body; // Extracting userId and rating from the request body
    try {
        const newRating = await Rating.create({ recipeId, userId, rating });
        res.status(201).json({ message: 'Rating added successfully', rating: newRating });
    } catch (error) {
        res.status(500).json({ message: 'Error adding rating', error: error.message });
    }
};


// Update an existing rating
exports.updateRating = async (req, res) => {
    const { ratingId } = req.params;
    const { rating } = req.body;
    try {
        const updatedRating = await Rating.update(ratingId, { rating });
        if (updatedRating) {
            res.status(200).json({ message: 'Rating updated successfully', rating: updatedRating });
        } else {
            res.status(404).json({ message: 'Rating not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error: error.message });
    }
};

// Get all ratings for a recipe
exports.getRatingsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    try {
        const ratings = await Rating.findByRecipeId(recipeId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ratings', error: error.message });
    }
};
