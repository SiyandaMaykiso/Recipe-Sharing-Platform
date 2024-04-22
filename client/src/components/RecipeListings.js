import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Correct import of the AuthContext

const RecipeListings = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // Using AuthContext to access current user data

  useEffect(() => {
    // Check for the existence of the token within the current user context
    if (!currentUser || !currentUser.token) {
      console.error('No token available. Redirecting to login.');
      navigate('/login');
      return;
    }

    console.log('Using token from context:', currentUser.token);

    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`, // Use the token from the context
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status on fetching recipes:", response.status); // Debug: Log the response status

        if (!response.ok) {
          const errorResponse = await response.text();
          throw new Error(`Failed to fetch recipes: ${response.status} ${errorResponse}`);
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        navigate('/login'); // Redirect to login on failure
      }
    };

    fetchRecipes();
  }, [navigate, currentUser]); // Dependency array includes currentUser to re-run effect on user/token change

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
