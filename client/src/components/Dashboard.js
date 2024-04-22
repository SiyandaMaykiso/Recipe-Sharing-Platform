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
        image: null,
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Retrieve token from localStorage
    const getTokenFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    // useEffect is now dependent on getTokenFromLocalStorage function
    
    useEffect(() => {
        console.log("Checking token status...");
        const token = getTokenFromLocalStorage();
        console.log("Token on load:", token); // Debugging line to check the token
        if (!token) {
            console.log("No token found, navigating to login.");
            navigate('/login');
        } else {
            console.log("Token found, fetching recipes.");
            fetchRecipes(token);
        }
    }, [getTokenFromLocalStorage, navigate]); // Adding getTokenFromLocalStorage to dependency array
    
    const fetchRecipes = async (token) => {
        try {
            const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
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

         window.scrollTo(0, 0);
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        if (name === "recipeImage") {
            handleImageChange(event);
        } else {
            setEditFormData(prev => ({
                ...prev,
                [name]: value !== '' ? value : prev[name]
            }));
            if (event.target.tagName.toLowerCase() === 'textarea') {
                autoExpandTextArea(event.target);
            }
        }
    };

    const handleImageChange = (event) => {
        setEditFormData(prevFormData => ({
            ...prevFormData,
            image: event.target.files[0] 
        }));
    };

    const autoExpandTextArea = (element) => {
        element.style.height = 'inherit';
        element.style.height = `${element.scrollHeight}px`; 
    };

    const saveEdit = async (event) => {
        event.preventDefault();  
    
        const formData = new FormData();
        formData.append('title', editFormData.title);
        formData.append('description', editFormData.description);
        formData.append('ingredients', editFormData.ingredients);
        formData.append('instructions', editFormData.instructions);
        if (editFormData.image) {
            formData.append('recipeImage', editFormData.image);
        }
    
        const token = getTokenFromLocalStorage();
    
        try {
            const response = await fetch(`https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes/${editFormData.recipe_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Error updating recipe:", errorResponse);
                setSuccessMessage(errorResponse.message || 'Failed to update the recipe. Please try again.');
                setTimeout(() => setSuccessMessage(''), 5000);
                return;
            }
    
            fetchRecipes(token);
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
        const token = getTokenFromLocalStorage();
        try {
            const response = await fetch(`https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete the recipe');
            fetchRecipes(token);
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
        style={{ overflow: 'hidden', resize: 'none' }} 
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
    style={{ overflow: 'hidden', resize: 'both' }}
    onInput={(e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }}
  />
</div>
                    <div className="form-control">
                    <label htmlFor="image">Recipe Image</label>
                    <input
                    type="file"
                     name="recipeImage"
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

