import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate function
  const [recipe, setRecipe] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0); // Initialize rating as 0
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
  
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken'); // Updated to use 'authToken'
    console.log("Token:", token); // Log the token to the console
  
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
          // Correctly include the token in the Authorization header
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json(); // Assuming the error details are in JSON format
        throw new Error(`Failed to post new comment: ${errorResponse.message}`);
      }
      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error("Error posting new comment:", error.message);
      setError(error.message); // Set the error state to display the message
    }
  };
  
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
  
    // Retrieve the token from localStorage for the rating submission
    const token = localStorage.getItem('authToken'); // Updated to use 'authToken'
    console.log("Token for rating:", token); // Log the token to the console for rating
  
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!response.ok) throw new Error('Failed to post new rating');
      // Fetch updated ratings here if necessary
      setNewRating(0); // Reset rating input
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        {/* Button to navigate back to the Dashboard */}
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>Back to Dashboard</button>
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>
      {/* Display more recipe details here */}

      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div key={index}>
          <p>{comment.content}</p>
        </div>
      ))}

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment"
        />
        <button type="submit">Post Comment</button>
      </form>

      {/* Rating submission section */}
      <div>
        <h3>Rate this recipe</h3>
        <form onSubmit={handleRatingSubmit}>
          <input
            type="number"
            min="1"
            max="5"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            placeholder="Rate 1-5"
          />
          <button type="submit">Submit Rating</button>
        </form>
      </div>
    </div>
  );
};

export default RecipeDetail;
