import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecipeListings = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        console.log('Fetched Recipes:', data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-listings">
      <h1>Recipes</h1>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className="recipe-card">
            <img
  src={recipe.image_path ? `http://localhost:3000/${recipe.image_path}` : '/default-recipe-image.jpg'}
  alt={recipe.title}
  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
/>
            <h3>
              <Link to={`/recipes/${recipe.recipe_id}`}>{recipe.title}</Link>
            </h3>
            <p>{recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListings;
