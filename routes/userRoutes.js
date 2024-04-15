const express = require('express');
const userController = require('../controllers/userController'); 
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload'); 
const router = express.Router();


router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/user/profile', authenticate, userController.getProfile);

console.log("Setting up user routes...");
router.put('/user/profile', authenticate, upload.single('profileImage'), userController.updateProfile);
console.log("User profile update route configured.");

router.delete('/user/delete', authenticate, userController.deleteAccount);

router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Access to protected data', user: req.user });
});

module.exports = router;
