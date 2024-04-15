import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3000/recipes/${id}`);
        if (!res.ok) throw new Error('Failed to fetch recipe details');
        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, [id]);

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Recipe link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container recipe-detail-container" style={{ maxWidth: '800px', margin: 'auto' }}>
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
      <button onClick={copyLinkToClipboard} className="btn btn-primary">Copy Recipe Link</button>
      {recipe && (
        <>
          <h2>{recipe.title}</h2>
          <img
            src={recipe.image_path ? `http://localhost:3000/${recipe.image_path}` : '/default-recipe-image.jpg'}
            alt={recipe.title}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '400px' }}
          />
          <h3>Description</h3>
          <p style={{ marginBottom: '20px' }}>{recipe.description}</p>
          <h3>Ingredients</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
            {recipe.ingredients ? recipe.ingredients.split('\n').map((ingredient, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>{ingredient}</li>
            )) : <li>No ingredients listed.</li>}
          </ul>
          <h3>Instructions</h3>
          <ol style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
            {recipe.instructions ? recipe.instructions.split('\n').map((step, index) => (
              <li key={index} style={{ marginBottom: '10px', paddingLeft: '20px' }}>{step}</li>
            )) : <li>No instructions provided.</li>}
          </ol>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;
