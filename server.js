require('dotenv').config();
const express = require('express');
// bodyParser is included with Express 4.16 and later, so direct use of express.json() and express.urlencoded() is recommended
const app = express();
const PORT = process.env.PORT || 3000;

// Import the Sequelize models
const { sequelize } = require('./models'); // Adjust the path according to your project structure

// Middleware for parsing request bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Import user routes
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary

// Use user routes with '/api/users' prefix
app.use('/api/users', userRoutes);

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
