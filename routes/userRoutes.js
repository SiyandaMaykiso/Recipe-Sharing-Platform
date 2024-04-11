const express = require('express');
const userController = require('../controllers/userController'); // Adjust as necessary
const { authenticate } = require('../middleware/auth'); // Import the authenticate middleware
const upload = require('../middleware/upload'); // Make sure this path is correct
const router = express.Router();

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// Fetch user profile (Protected)
router.get('/user/profile', authenticate, userController.getProfile);

// Update user profile (Protected) with profile image upload
router.put('/user/profile', authenticate, upload.single('profileImage'), userController.updateProfile);

// Delete user account (Protected)
router.delete('/user/delete', authenticate, userController.deleteAccount);

// A sample protected route that checks for a valid JWT token
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
