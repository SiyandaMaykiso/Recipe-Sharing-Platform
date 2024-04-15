const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

dotenv.config();

const app = express();

console.log("Configuring middleware...");
app.use(cors());
app.use(express.json());

console.log("Setting up static file serving...");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("Loading route handlers...");
app.use(userRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);

app.get('/', (req, res) => {
  console.log("Root route accessed.");
  res.send('Recipe Sharing Platform API is running...');
});

// Catch-all for 404 errors
app.use((req, res, next) => {
  console.log("Handling 404 error.");
  res.status(404).send('Sorry, that route does not exist.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}. All configurations loaded successfully.`));