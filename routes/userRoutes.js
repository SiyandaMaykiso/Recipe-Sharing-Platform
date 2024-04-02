const express = require('express');
const userController = require('../controllers/userController'); // Adjust as necessary
const { authenticate } = require('../middleware/auth'); // Import the authenticate middleware

const router = express.Router();

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// Fetch user profile (Protected)
router.get('/user/profile', authenticate, userController.getProfile);

// Update user profile (Protected)
router.put('/user/profile', authenticate, userController.updateProfile);

// Delete user account (Protected)
router.delete('/user/delete', authenticate, userController.deleteAccount);

module.exports = router;
