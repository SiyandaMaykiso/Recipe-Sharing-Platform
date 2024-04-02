import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeIdToFetch, setRecipeIdToFetch] = useState(''); // State to hold the ID input by the user

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const fetchRecipeById = async () => {
    if (!recipeIdToFetch) return; // Check if the ID field is not empty
    try {
      const response = await fetch(`http://localhost:3000/recipes/${recipeIdToFetch}`);
      if (!response.ok) {
        throw new Error('Failed to fetch the recipe');
      }
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Recipes</h1>
      <Link to="/add-recipe" className="add-recipe-button">Add New Recipe</Link>
      {/* Form for fetching a recipe by ID */}
      <div>
        <input
          type="text"
          value={recipeIdToFetch}
          onChange={(e) => setRecipeIdToFetch(e.target.value)}
          placeholder="Enter Recipe ID"
        />
        <button onClick={fetchRecipeById}>Fetch Recipe</button>
      </div>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
      {selectedRecipe && (
        <div>
          <h2>Recipe Details</h2>
          <p>Title: {selectedRecipe.title}</p>
          {/* Display more details of the selected recipe */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
