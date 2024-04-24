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


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'client', 'build')));


app.use(userRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);
app.use(commentRoutes);
app.use(ratingRoutes);


app.get('*', (req, res, next) => {
  
  if (req.accepts('html')) {
    console.log('Serving index.html for path:', req.path);
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  } else {
    next(); 
  }
});


app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist.');
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
