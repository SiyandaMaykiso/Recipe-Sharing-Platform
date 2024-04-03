import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: null, title: '', description: '' });
  const [fetchId, setFetchId] = useState(''); // State for input of ID to fetch
  const [fetchedRecipe, setFetchedRecipe] = useState(null); // State to store the fetched recipe

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const startEdit = (recipe) => {
    setIsEditing(true);
    setEditFormData({ id: recipe.id, title: recipe.title, description: recipe.description });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const saveEdit = async () => {
    const { id, title, description } = editFormData;
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Failed to update the recipe');

      setRecipes(recipes.map(recipe => recipe.id === id ? { ...recipe, title, description } : recipe));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the recipe.');

      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const fetchRecipeById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/recipes/${fetchId}`);
      if (!response.ok) throw new Error('Failed to fetch the recipe');
      const data = await response.json();
      setFetchedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe by ID:", error);
      setFetchedRecipe(null); // Reset on error
    }
  };

  return (
    <div className="dashboard">
      <h1>Recipes</h1>
      <Link to="/add-recipe" className="add-recipe-button">Add New Recipe</Link>
      <Link to="/recipes" className="view-recipes-button">View Recipes</Link>
      {isEditing ? (
        <div>
          <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} />
          <input type="text" name="description" value={editFormData.description} onChange={handleEditFormChange} />
          <button onClick={saveEdit}>Save</button>
        </div>
      ) : (
        <>
          <div>
            <input
              type="text"
              value={fetchId}
              onChange={(e) => setFetchId(e.target.value)}
              placeholder="Enter Recipe ID"
            />
            <button onClick={fetchRecipeById}>Fetch Recipe</button>
          </div>
          {fetchedRecipe && (
            <div>
              <h2>Recipe Details</h2>
              <p>Title: {fetchedRecipe.title}</p>
              <p>Description: {fetchedRecipe.description}</p>
              {/* Display more details of the fetched recipe */}
            </div>
          )}
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                {recipe.title}
                <button onClick={() => startEdit(recipe)}>Edit</button>
                <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
