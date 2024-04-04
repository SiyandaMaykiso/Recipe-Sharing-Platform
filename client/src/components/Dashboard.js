import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: null, title: '', description: '' });
  const [fetchId, setFetchId] = useState('');
  const [fetchedRecipe, setFetchedRecipe] = useState(null);

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
      <h1 className="main-header">Recipes Dashboard</h1>
      <div className="nav-links">
        <Link to="/add-recipe" className="btn btn-primary">Add New Recipe</Link>
        <Link to="/recipes" className="btn btn-secondary">View Recipes</Link>
        <Link to="/user" className="btn">View Profile</Link> {/* Styling for navigation to UserProfile */}
      </div>

      {isEditing ? (
        <form className="form-control">
          <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="ingredient-input" />
          <input type="text" name="description" value={editFormData.description} onChange={handleEditFormChange} className="ingredient-input" />
          <button className="btn" onClick={saveEdit}>Save</button>
        </form>
      ) : (
        <>
          <div className="form-control">
            <input
              type="text"
              value={fetchId}
              onChange={(e) => setFetchId(e.target.value)}
              placeholder="Enter Recipe ID"
              className="ingredient-input"
            />
            <button className="btn" onClick={fetchRecipeById}>Fetch Recipe</button>
          </div>
          {fetchedRecipe && (
            <div className="card">
              <h2>Recipe Details</h2>
              <p><strong>Title:</strong> {fetchedRecipe.title}</p>
              <p><strong>Description:</strong> {fetchedRecipe.description}</p>
              {/* Consider adding more details */}
            </div>
          )}
          <ul className="recipe-list">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="recipe-item">
                <span className="recipe-title">{recipe.title}</span>
                <div className="recipe-actions">
                  <button className="btn" onClick={() => startEdit(recipe)}>Edit</button>
                  <button className="btn" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;