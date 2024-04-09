const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Make sure to require 'path'

// Import routes
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Initialize dotenv to use .env file variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enables CORS for all requests. Customize as needed.
app.use(express.json()); // Parses incoming requests with JSON payloads

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use(userRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);

// Default route for testing the server
app.get('/', (req, res) => {
  res.send('Recipe Sharing Platform API is running...');
});

// Handle undefined routes with a 404 response
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
