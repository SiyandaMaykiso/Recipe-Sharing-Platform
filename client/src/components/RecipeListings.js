import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecipeListings = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getTokenFromLocalStorage();
        if (!token) {
            navigate('/login');
            return;
        }

        fetchRecipes(token);
    }, [navigate]);

    const getTokenFromLocalStorage = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

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
            navigate('/login'); // Redirect to login on fetch failure
        }
    };

    return (
        <div className="recipe-listings" style={{ maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
            <h1>Recipes</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {recipes.map((recipe) => (
                    <div key={recipe.recipe_id} className="recipe-card" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        <img
                            src={recipe.image_path || '/default-recipe-image.jpg'}
                            alt={recipe.title}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description.length > 100 ? `${recipe.description.substring(0, 100)}...` : recipe.description}</p>
                        <Link to={`/recipes/${recipe.recipe_id}`} className="btn">View Recipe</Link>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginTop: '20px' }}>Back to Dashboard</button>
        </div>
    );
};

export default RecipeListings;