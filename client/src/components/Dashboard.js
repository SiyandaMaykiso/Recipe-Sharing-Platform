import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    // Correct the initial state to include recipe_id instead of id
    const [editFormData, setEditFormData] = useState({
        recipe_id: null,
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Fetch recipes on mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        if (!token) {
            navigate('/login');
        } else {
            fetchRecipes(token);
        }
    }, [navigate]);

    // Fetch recipes from the API
    const fetchRecipes = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/recipes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch recipes');
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    // Initialize editing state
    const startEdit = (recipe) => {
        console.log('Starting edit for:', recipe);
        setIsEditing(true);
        setEditFormData({
            recipe_id: recipe.recipe_id, // Ensure we're using recipe_id from the recipe object
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients || '',
            instructions: recipe.instructions || '',
        });
    };

    // Handle form field changes
    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    // Save edits to the API
    const saveEdit = async () => {
        const { recipe_id, title, description, ingredients, instructions } = editFormData;
        console.log(`Attempting to update recipe with ID: ${recipe_id}`); // Added log to check ID
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;

        try {
            const response = await fetch(`http://localhost:3000/recipes/${recipe_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, ingredients, instructions }),
            });

            if (!response.ok) throw new Error('Failed to update the recipe');
            fetchRecipes(token); // Refresh the recipes list
            setIsEditing(false);
            setSuccessMessage('Recipe updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating recipe:", error);
            setSuccessMessage('Failed to update the recipe. Please try again.');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    // Delete a recipe
    const deleteRecipe = async (recipeId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete the recipe');
            fetchRecipes(token); // Refresh the recipes list
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    return (
        <div className="dashboard">
            <h1>Recipes Dashboard</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="nav-links">
                <Link to="/add-recipe" className="btn btn-primary">Add New Recipe</Link>
                <Link to="/recipes" className="btn btn-secondary">View Recipes</Link>
                <Link to="/user" className="btn">View Profile</Link>
            </div>
            {isEditing && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div>
                        <label>Ingredients</label>
                        <textarea
                            name="ingredients"
                            value={editFormData.ingredients}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div>
                        <label>Instructions</label>
                        <textarea
                            name="instructions"
                            value={editFormData.instructions}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <button type="button" onClick={saveEdit}>Save</button>
                </form>
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

        </div>
    );
};

export default Dashboard;