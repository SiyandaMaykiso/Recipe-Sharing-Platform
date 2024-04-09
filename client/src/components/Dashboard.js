import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        recipe_id: null,
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        if (!token) {
            navigate('/login');
        } else {
            fetchRecipes(token);
        }
    }, [navigate]);

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

    const startEdit = (recipe) => {
        setIsEditing(true);
        setEditFormData({
            recipe_id: recipe.recipe_id,
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients || '',
            instructions: recipe.instructions || '',
        });
    };

      const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
        autoExpandTextArea(event.target);
    };

    const saveEdit = async () => {
        const { recipe_id, title, description, ingredients, instructions } = editFormData;
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
            fetchRecipes(token); // Refresh the recipes list to reflect the update
            setIsEditing(false);
            setSuccessMessage('Recipe updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating recipe:", error);
            setSuccessMessage('Failed to update the recipe. Please try again.');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

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
            fetchRecipes(token); // Refresh the recipes list to reflect the deletion
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

       // Function to auto-expand text areas
       const autoExpandTextArea = (element) => {
        element.style.height = 'inherit';
        element.style.height = `${element.scrollHeight}px`; // Adjust height based on scroll height
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
                <form onSubmit={(e) => e.preventDefault()} className="form-container">
                    <div className="form-control">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditFormChange}
                            className="ingredient-input"
                        />
                    </div>
                    <div className="form-control">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditFormChange}
                            className="ingredient-input"
                            style={{ overflow: 'hidden' }}
                            onInput={(e) => {
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                        />
                    </div>
                    <div className="form-control">
                        <label>Ingredients</label>
                        <textarea
                            name="ingredients"
                            value={editFormData.ingredients}
                            onChange={handleEditFormChange}
                            className="ingredient-input"
                        />
                    </div>
                    <div className="form-control">
                    <label>Instructions</label>
                        <textarea
                            name="instructions"
                            value={editFormData.instructions}
                            onChange={handleEditFormChange}
                            className="ingredient-input"
                            style={{ overflow: 'hidden', resize: 'none' }} // Prevent manual resizing
                        />
                    </div>
                    <button type="button" onClick={saveEdit} className="btn">Save</button>
                </form>
            )}
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                    <li key={recipe.recipe_id} className="recipe-item">
                        <span className="recipe-title">{recipe.title}</span>
                        <div className="recipe-actions">
                            <button className="btn" onClick={() => startEdit(recipe)}>Edit</button>
                            <button className="btn" onClick={() => deleteRecipe(recipe.recipe_id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
