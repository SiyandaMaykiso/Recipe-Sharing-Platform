const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust the path as necessary

router.post('/register', userController.register); // Registration endpoint

module.exports = router;
