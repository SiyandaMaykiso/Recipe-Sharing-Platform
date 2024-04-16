import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, EmailShareButton, EmailIcon } from 'react-share';

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

  const url = window.location.href;
  const title = `Check out this recipe: ${recipe.title}`;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container recipe-detail-container" style={{ maxWidth: '800px', margin: 'auto' }}>
      <div className="navigation-buttons">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
        <button onClick={() => navigate('/recipes')} className="btn btn-secondary">Back to Recipes</button>
        <button onClick={() => navigator.clipboard.writeText(url)} className="btn btn-primary">Copy Recipe Link</button>
      </div>
      {recipe && (
        <>
          <h2>{recipe.title}</h2>
          <img
            src={recipe.image_path ? recipe.image_path : '/default-recipe-image.jpg'}
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
          {/* Social Media Sharing Buttons */}
          <div style={{ marginTop: '30px' }}>
            <FacebookShareButton url={url} quote={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            <EmailShareButton url={url} subject={title} body="Check out this recipe!">
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;