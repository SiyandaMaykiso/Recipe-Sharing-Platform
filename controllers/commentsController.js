// controllers/commentsController.js
const { Comment } = require('../models');

// Create a new comment
exports.createComment = async (req, res) => {
    const { commentText, recipeId, userId } = req.body;
    try {
        const comment = await Comment.create({ commentText, recipeId, userId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Fetch all comments
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a single comment by ID
exports.getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
        } else {
            res.json(comment);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { commentText } = req.body;
    try {
        const comment = await Comment.findByPk(id);
        if (comment) {
            comment.commentText = commentText;
            await comment.save();
            res.json(comment);
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Comment.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send(); // Successfully deleted, no content to send back
        } else {
            res.status(404).json({ message: "Comment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
