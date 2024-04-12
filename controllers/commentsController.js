const Comment = require('../models/comment');

exports.postComment = async (req, res) => {
   
    const { recipeId } = req.params;
    
    const userId = req.user.userId;
    
    const { content } = req.body;

    try {
       
        const newComment = await Comment.create({
            recipeId,
            userId,
            commentText: content 
        });
        res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: 'Error posting comment', error: error.toString() });
    }
};




exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { commentText } = req.body; 
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

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        await Comment.delete(commentId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

exports.getCommentsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    console.log("Fetching comments for recipe ID:", recipeId);
    try {
        const comments = await Comment.findByRecipeId(recipeId);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error retrieving comments for recipe ID:", recipeId, error);
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};