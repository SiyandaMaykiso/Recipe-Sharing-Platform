import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const recipeRes = await fetch(`http://localhost:3000/recipes/${id}`);
        if (!recipeRes.ok) throw new Error('Failed to fetch recipe details');
        const recipeData = await recipeRes.json();
        setRecipe(recipeData);

        const commentsRes = await fetch(`http://localhost:3000/recipes/${id}/comments`);
        if (!commentsRes.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchData();
  }, [id]);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    
    const token = localStorage.getItem('authToken');
    console.log("Token:", token);
  
    if (!token) {
      console.error("No authentication token found");
      setError("You must be logged in to post a comment.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json(); 
        throw new Error(`Failed to post new comment: ${errorResponse.message}`);
      }
      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error("Error posting new comment:", error.message);
      setError(error.message); 
    }
  };
  
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken');
    console.log("Token for rating:", token);
  
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!response.ok) throw new Error('Failed to post new rating');
     
      setNewRating(0);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

   return (
    <div className="container recipe-detail-container">
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '20px' }}>Back to Dashboard</button>
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          className="textarea"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment"
        />
        <button type="submit" className="btn btn-primary">Post Comment</button>
      </form>

      <div className="rating-section">
        <h3>Rate this recipe</h3>
        <form onSubmit={handleRatingSubmit} className="rating-form">
          <input
            className="input"
            type="number"
            min="1"
            max="5"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            placeholder="Rate 1-5"
          />
          <button type="submit" className="btn btn-primary">Submit Rating</button>
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RecipeDetail;