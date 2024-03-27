const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return new user (excluding password) and token
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering new user', error: error.toString() });
  }
};

exports.login = async (req, res) => {
  // Implementation for login remains unchanged
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by your auth middleware
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclude password from the results
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.toString() });
  }
};

exports.updateUserInfo = async (req, res) => {
  // Implementation for updateUserInfo remains unchanged
};
