const jwt = require('jsonwebtoken');

const handleAuthError = (res, message, statusCode = 401) => {
    console.log(message);
    return res.status(statusCode).json({ message });
};

const authenticate = (req, res, next) => {
    console.log("Authenticating request...");
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return handleAuthError(res, "Authentication token is required");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        if (!decoded.id) {
            return handleAuthError(res, "User ID is missing from the token");
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification error:", error.message);
        return handleAuthError(res, "Invalid or expired token", 403);
    }
};

module.exports = {
    authenticate
};
