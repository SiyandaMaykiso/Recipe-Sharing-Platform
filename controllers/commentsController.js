const Comment = require('../models/comment'); // Adjust the path as necessary

// Post a new comment
exports.postComment = async (req, res) => {
    const { recipeId, userId, content } = req.body; // Extract comment text from "content" field
    try {
        const newComment = await Comment.create({ recipeId, userId, commentText: content }); // Pass content as commentText
        res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Error posting comment', error: error.message });
    }
};


// Update an existing comment
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { commentText } = req.body; // Assume this is the field to update
    try {
        const updatedComment = await Comment.update(commentId, { commentText });
        if (updatedComment) {
            res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        await Comment.delete(commentId);
        res.status(204).send(); // No content to send back upon successful deletion
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

// Get all comments for a recipe
exports.getCommentsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    try {
        const comments = await Comment.findByRecipeId(recipeId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};
