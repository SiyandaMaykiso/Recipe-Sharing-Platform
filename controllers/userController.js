const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Normalize and trim email and username
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    const userExists = await User.findOne({ where: { email: normalizedEmail } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).json({ message: 'Error registering new user' });
  }
};

exports.login = async (req, res) => {
  try {
    // Normalize and trim email
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    const [numberOfAffectedRows] = await User.update(
      { username: trimmedUsername, email: normalizedEmail },
      { where: { id: userId } }
    );

    if (numberOfAffectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    res.status(200).json({ message: "User information updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Error updating user information" });
  }
};
