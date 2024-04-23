import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { authToken, loading } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        recipe_id: null,
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        image: null,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const fetchRecipes = useCallback(async () => {
        if (loading || !authToken) {
            if (!authToken) navigate('/login-page');
            return;
        }

        try {
            const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) throw new Error('Failed to fetch recipes');

            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }, [authToken, navigate, loading]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

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

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        setEditFormData((prev) => ({
            ...prev,
            image: event.target.files[0]
        }));
    };

    const saveEdit = async () => {
        const formData = new FormData();
        Object.entries(editFormData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const response = await fetch(`https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes/${editFormData.recipe_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to update recipe');

            setSuccessMessage('Recipe updated successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            fetchRecipes();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating recipe:", error);
            setSuccessMessage('Failed to update the recipe. Please try again.');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    const deleteRecipe = async (recipeId) => {
        try {
            const response = await fetch(`https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete recipe');

            setSuccessMessage('Recipe deleted successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            fetchRecipes();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            setSuccessMessage('Failed to delete the recipe. Please try again.');
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    };

    return (
        <div className="dashboard">
            <h1>Recipes Dashboard</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="nav-links">
                <Link to="/add-recipe" className="btn btn-primary">Add New Recipe</Link>
                <Link to="/view-recipe" className="btn btn-secondary">View Recipes</Link>
                <Link to="/user" className="btn">View Profile</Link>
            </div>
            {isEditing && (
                <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data" className="form-container">
                    <div className="form-control">
                        <label>Title</label>
                        <input type="text" name="title" value={editFormData.title} onChange={handleFormChange} className="ingredient-input" />
                    </div>
                    <div className="form-control">
                        <label>Description</label>
                        <textarea name="description" value={editFormData.description} onChange={handleFormChange} className="ingredient-input" />
                    </div>
                    <div className="form-control">
                        <label>Ingredients</label>
                        <textarea name="ingredients" value={editFormData.ingredients} onChange={handleFormChange} className="ingredient-input" />
                    </div>
                    <div className="form-control">
                        <label>Instructions</label>
                        <textarea name="instructions" value={editFormData.instructions} onChange={handleFormChange} className="ingredient-input" />
                    </div>
                    <div className="form-control">
                        <label htmlFor="image">Recipe Image</label>
                        <input type="file" name="recipeImage" onChange={handleImageChange} />
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
