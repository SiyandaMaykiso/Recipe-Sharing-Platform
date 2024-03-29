const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Ensure you have this middleware set up
const userController = require('../controllers/userController'); // Adjust the path as necessary

// Registration endpoint does not require authentication
router.post('/register', userController.register);

// Assuming you have a login endpoint (important for authentication)
router.post('/login', userController.login);

// Example of a user profile route that requires authentication
// This is a placeholder. Implement the corresponding method in your userController
router.get('/profile', authMiddleware, userController.getProfile);

// Any other user-specific routes that require authentication
// e.g., updating user information
router.put('/update', authMiddleware, userController.updateUserInfo);

module.exports = router;