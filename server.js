require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import the Sequelize models
const { sequelize } = require('./models'); // Adjust the path according to your project structure

// Middleware for parsing request bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Import routes
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const recipeRoutes = require('./routes/recipeRoutes'); // Ensure you have this file set up
const ingredientRoutes = require('./routes/ingredientRoutes'); // Adjust path as necessary

// Use routes with their respective prefixes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes); // Include recipe routes in the server setup
app.use('/api/ingredients', ingredientRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Check database connection and start server
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
