const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { parser } = require('../middleware/cloudinaryConfig'); // ensure this is correct

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/profile', authenticate, userController.getProfile);

// Make sure you are logging for debugging purposes
console.log("Setting up user routes...");
router.put('/user/profile', authenticate, parser.single('profileImage'), userController.updateProfile);
console.log("User profile update route configured.");

router.delete('/user/delete', authenticate, userController.deleteAccount);
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
