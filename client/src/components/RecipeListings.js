import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecipeListings = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;

    if (!token) {
      console.error('No token available');
      navigate('/login');
      return;
    }

    console.log("Sending token:", token); // Debug token value

    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status:", response.status); // Debug response status

        if (!response.ok) throw new Error(`Failed to fetch recipes: ${response.statusText}`);

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [navigate]);

  return (
    <div className="recipe-listings" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Recipes</h1>
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <div className="recipes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className="recipe-card" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src={recipe.image_path ? recipe.image_path : '/default-recipe-image.jpg'}
              alt={recipe.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <h3>{recipe.title}</h3>
            <Link to={`/recipes/${recipe.recipe_id}`} className="btn">
              View Recipe
            </Link>
            <p>{recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListings;
