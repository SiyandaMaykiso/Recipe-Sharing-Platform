const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const generateAccessToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
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
        res.status(201).json({ message: 'User created successfully', userId: newUser.user_id });
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

        const token = jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: userPassword, ...userInfo } = user;

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
        req.user = decoded;
        next();
    });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user.userId;
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
        await User.delete(req.user.userId);
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

        const accessToken = generateAccessToken(decoded.userId, decoded.email);

        res.json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};