const express = require('express');
const userController = require('../controllers/userController'); // Adjust as necessary

const router = express.Router();

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// Fetch user profile (Protected)
router.get('/user/profile', userController.getProfile);

// Update user profile (Protected)
router.put('/user/profile', userController.updateProfile);

// Delete user account (Protected)
router.delete('/user/delete', userController.deleteAccount);

// Existing protected route example
// You can replace or remove this with actual routes you need
router.get('/protected', (req, res) => {
    res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
