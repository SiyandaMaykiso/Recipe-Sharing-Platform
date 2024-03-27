const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Adjust the path as necessary

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    
    // Create a new user
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword 
    });
    
    res.status(201).json(user); // Respond with the created user (consider excluding the password)
  } catch (error) {
    res.status(500).json({ message: "Error registering new user", error: error.message });
  }
};
