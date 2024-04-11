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
        image: null, // Added for image handling
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Checking user token on dashboard:', localStorage.getItem('token'));
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

        // Scroll to the top of the page or to the top of the form
         window.scrollTo(0, 0); // This scrolls to the top of the page
        // If the form is not at the very top of the page, you might need to adjust the second argument to scrollTo to the pixel height where the form begins.

    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        if (name === "recipeImage") {
            // For file input, handle separately
            handleImageChange(event); // This calls a separate function for handling image change
        } else {
            // For all other inputs, including textareas for auto-expansion
            setEditFormData(prev => ({ ...prev, [name]: value }));
            if(event.target.tagName.toLowerCase() === 'textarea') {
                autoExpandTextArea(event.target);
            }
        }
    };
    
    const handleImageChange = (event) => {
        // Directly updates the state with the file, assuming "image" is the correct field name
        setEditFormData(prevFormData => ({
            ...prevFormData,
            image: event.target.files[0] // Gets the file from the input field
        }));
    };
    
    const autoExpandTextArea = (element) => {
        element.style.height = 'inherit';
        element.style.height = `${element.scrollHeight}px`; // Adjusts height based on content
    };

    const saveEdit = async () => {
        const formData = new FormData();
        formData.append('title', editFormData.title);
        formData.append('description', editFormData.description);
        formData.append('ingredients', editFormData.ingredients);
        formData.append('instructions', editFormData.instructions);
        if (editFormData.image) {
            formData.append('recipeImage', editFormData.image);
        }
    
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
    
        try {
            const response = await fetch(`http://localhost:3000/recipes/${editFormData.recipe_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error updating recipe:", errorResponse);
                // Display the error message from the response if available, or a generic error message
                setSuccessMessage(errorResponse.message || 'Failed to update the recipe. Please try again.');
                setTimeout(() => setSuccessMessage(''), 5000);
                return; // Exit the function early since the update failed
            }
    
            // If the response is OK, proceed to refresh the recipes list and show a success message
            fetchRecipes(token); // Refresh to show updated list
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
            fetchRecipes(token); // Refresh to show updated list
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
            <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data" className="form-container">
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
                    <div className="form-control">
                    <label htmlFor="image">Recipe Image</label>
                    <input
                    type="file"
                     name="recipeImage" // This name now matches the server expectation
                     onChange={handleEditFormChange}
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
