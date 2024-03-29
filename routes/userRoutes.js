const express = require('express');
const { authenticate } = require('./middleware/auth'); // Correcting the path based on standard structure
const userController = require('../controllers/userController'); // Adjust as necessary

const router = express.Router();

// Fetch user profile (Protected)
router.get('/user/profile', authenticate, userController.getProfile);

// Update user profile (Protected)
router.put('/user/profile', authenticate, userController.updateProfile);

// Delete user account (Protected)
router.delete('/user/delete', authenticate, userController.deleteAccount);

// Existing protected route example
// You can replace or remove this with actual routes you need
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
