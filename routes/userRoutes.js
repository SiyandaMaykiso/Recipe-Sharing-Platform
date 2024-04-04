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

// Update user profile (Protected)
router.put('/user/profile', authenticate, userController.updateProfile);

// Delete user account (Protected)
router.delete('/user/delete', authenticate, userController.deleteAccount);

// A sample protected route that checks for a valid JWT token
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access to protected data', user: req.user });
});

// Route for profile picture upload
router.post('/profile/upload', authenticate, upload.single('profileImage'), (req, res) => {
  if (req.file) {
    // Process the file, save the file path to the user's profile, etc.
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully!',
      filePath: req.file.path
    });
  } else {
    res.status(400).send('No file uploaded.');
  }
});

module.exports = router;
