const Comment = require('../models/comment'); // Adjust the path as necessary

// Post a new comment
exports.postComment = async (req, res) => {
    // Extracting recipeId from the URL path parameters
    const { recipeId } = req.params;
    // Assuming the userId is available through some form of authentication middleware
    const userId = req.user.userId;
    // Extracting the content of the comment from the request body
    const { content } = req.body;

    try {
        // Passing the extracted content as commentText to the Comment model's create method
        const newComment = await Comment.create({
            recipeId,
            userId,
            commentText: content  // Ensure this matches the column name in your table
        });
        res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: 'Error posting comment', error: error.toString() });
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
    console.log("Fetching comments for recipe ID:", recipeId); // Diagnostic log
    try {
        const comments = await Comment.findByRecipeId(recipeId);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error retrieving comments for recipe ID:", recipeId, error); // Detailed error log
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};