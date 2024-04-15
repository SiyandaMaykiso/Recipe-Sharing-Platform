const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const generateAccessToken = (id, email) => {
    return jwt.sign(
        { id, email },  // Standardized payload to use 'id'
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create(username, email, hashedPassword);
        const token = generateAccessToken(newUser.user_id, newUser.email); // Consistently using the same JWT payload structure

        res.status(201).json({
            message: 'User created successfully',
            user: {
                userId: newUser.user_id,
                username: newUser.username,
                email: newUser.email
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
};

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

        const token = generateAccessToken(user.user_id, user.email);  // Use the revised function here

        const { password: _, ...userInfo } = user;  // Properly omit the password from the response

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userInfo
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = decoded; // Ensuring that decoded token information is attached to the request object
        next();
    });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Adjusted to use 'id' from the standardized token payload
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.id; // Using 'id' from token
    let updateFields = {};

    if (req.file) {
        updateFields.profile_image_path = req.file.path;
    }

    if (Object.keys(updateFields).length > 0) {
        try {
            const updatedUser = await User.update(userId, updateFields);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    } else {
        res.status(400).json({ message: 'No update fields provided' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.delete(req.user.id); // Using 'id' from token
        res.status(204).send();
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
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken(decoded.id, decoded.email); // Corrected to use 'id'

        res.json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};
