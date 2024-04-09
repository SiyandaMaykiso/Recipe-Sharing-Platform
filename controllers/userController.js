const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path as necessary

const generateAccessToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(username, email, hashedPassword);
        res.status(201).json({ message: 'User created successfully', userId: newUser.user_id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
};

// User login with JWT
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Exclude password and any other sensitive info from the response
        const { password: userPassword, ...userInfo } = user;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userInfo // Include user info in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// JWT Middleware for protected routes
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = decoded;
        next();
    });
};

// Fetch user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password, ...userInfo } = user; // Exclude password from the response
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Update user profile to include profile picture handling
exports.updateProfile = async (req, res) => {
    const userId = req.user.userId; // Get userId from the authenticated user
    const { username, email } = req.body;
    const profileImagePath = req.file ? req.file.path : null; // Access the uploaded file path

    try {
        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (profileImagePath) updateFields.profileImagePath = profileImagePath; // Add profile image path to update fields if file is uploaded

        const updatedUser = await User.update(userId, updateFields);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally, return the updated user information, excluding sensitive data
        const { password, ...updatedUserInfo } = updatedUser;
        
        res.json({ message: 'Profile updated successfully', user: updatedUserInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        await User.delete(req.user.userId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // If refresh token is valid, generate a new access token
        const accessToken = generateAccessToken(decoded.userId, decoded.email);

        // Send the new access token to the client
        res.json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};