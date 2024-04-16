const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    console.log("Authenticating request...");
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Authentication token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        // Explicitly check for the 'id' field in the decoded token
        if (!decoded.id) {
            console.log("User ID is missing from the decoded token:", decoded);
            return res.status(401).json({ message: "User ID is missing from the token" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    authenticate
};