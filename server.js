const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Debug: Log environment variables to verify they are loaded (Do not do this in production!)
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL ? "Success" : "Failed");
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET ? "Success" : "Failed");

console.log("Configuring middleware...");
app.use(cors());
app.use(express.json());

console.log("Setting up static file serving...");
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

console.log("Loading route handlers...");
app.use(userRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.use((req, res, next) => {
  console.log("Handling 404 error.");
  res.status(404).send('Sorry, that route does not exist.');
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. All configurations loaded successfully.`));
