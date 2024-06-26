const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const { profileParser } = require('../middleware/cloudinaryConfig');

console.log("Setting up user routes...");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/profile', authenticate, userController.getProfile);


router.put('/user/profile', authenticate, profileParser.single('profileImage'), userController.updateProfile);
console.log("User profile update route configured.");

router.delete('/user/delete', authenticate, userController.deleteAccount);
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
