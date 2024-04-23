const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route imports
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// API routes
app.use(userRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);

// Catch-all handler for SPA - ensure this is after all other routes
app.get('*', (req, res, next) => {
  // Only send the index.html for text/html requests
  if (req.accepts('html')) {
    console.log('Serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  } else {
    next(); // Continue to other routes if not requesting HTML
  }
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
