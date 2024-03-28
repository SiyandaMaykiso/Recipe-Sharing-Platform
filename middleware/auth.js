// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  try {
    // Extract the token without 'Bearer ' prefix
    const tokenWithoutPrefix = token.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).send({ message: 'Invalid token.' });
  }
};

module.exports = auth;
