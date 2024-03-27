const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Make sure to install this package
const { User } = require('../models'); // Adjust the path as necessary

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email } }); // Respond with the created user (excluding the password)
  } catch (error) {
    res.status(500).json({ message: "Error registering new user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET, // Make sure to define this in your .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
