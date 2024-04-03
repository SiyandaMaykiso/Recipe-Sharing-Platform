import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecipeListings = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        console.log('Fetched Recipes:', data); // Log fetched recipes to debug
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  if (recipes.length === 0) {
    return <p>Loading recipes...</p>;
  }

  return (
    <div className="recipe-listings">
      <h1>Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id || recipe.recipe_id} className="recipe-card"> {/* Adjust key to match your data */}
            <img src={recipe.imagePath || '/default-recipe-image.jpg'} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h3><Link to={`/recipes/${recipe.id || recipe.recipe_id}`}>{recipe.title}</Link></h3> {/* Adjust the link to match your data */}
            <p>{recipe.description.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListings;
