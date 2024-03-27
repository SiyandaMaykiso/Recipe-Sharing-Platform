const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Make sure to install this package
const { User } = require('../models'); // Adjust the path as necessary

exports.register = async (req, res) => {
  // Existing register code
};

exports.login = async (req, res) => {
  // Existing login code
};

// Retrieve user profile information
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by your auth middleware
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Exclude sensitive information like password
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update user information
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by your auth middleware
    const { username, email } = req.body;
    // Update user information
    const [numberOfAffectedRows] = await User.update({ username, email }, { where: { id: userId } });
    
    if (numberOfAffectedRows === 0) {
      // No rows were affected, which means the user was not found
      return res.status(404).json({ message: "User not found" });
    }
    
    // Fetch the updated user information to send back as response
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude the password from the response
    });

    res.status(200).json({ message: "User information updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user information", error: error.message });
  }
};
