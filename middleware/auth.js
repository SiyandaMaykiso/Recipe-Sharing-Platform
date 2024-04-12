const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token is required" });
    }

    console.log("Extracted Token:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    authenticate
};