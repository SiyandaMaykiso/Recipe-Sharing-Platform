import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const recipeResponse = await fetch(`http://localhost:3000/recipes/${id}`);
      const recipeData = await recipeResponse.json();
      setRecipe(recipeData);
    };

    const fetchComments = async () => {
        try {
          const commentsResponse = await fetch(`http://localhost:3000/recipes/${id}/comments`);
          if (!commentsResponse.ok) {
            throw new Error('Failed to fetch comments');
          }
          const commentsData = await commentsResponse.json();
          setComments(commentsData); // Assume commentsData is an array
        } catch (error) {
          console.error("Error fetching comments:", error);
          setComments([]); // Ensure comments is reset to an empty array on error
        }
    };

    fetchRecipeDetails();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Assuming you have a backend endpoint to handle POST requests for adding a comment
    const commentResponse = await fetch(`http://localhost:3000/recipes/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authorization header if your endpoint requires authentication
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        content: newComment,
        // You might need to include additional fields as required by your backend, like userId
      }),
    });

    if (commentResponse.ok) {
      setNewComment(''); // Reset comment input field
      // Refresh comments to include the new comment
      const updatedCommentsResponse = await fetch(`http://localhost:3000/recipes/${id}/comments`);
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(updatedCommentsData);
    } else {
      // Handle error case
      console.error('Failed to post comment');
    }
  };

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div>
      <h2>{recipe.title}</h2>
      {/* Display other recipe details like ingredients and description here */}

      <div>
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index}>
            <p>{comment.author}: {comment.content}</p>
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
      </div>
    </div>
  );
};

export default RecipeDetail;
