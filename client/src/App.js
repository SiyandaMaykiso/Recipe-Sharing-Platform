import './App.css'; // Add this line at the top of your App.js file
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import Home from './components/Home'; // Import the Home component
import Login from './components/Login'; // Import Login
import Registration from './components/Registration'; // Import Registration

function App() {
  const recipeFormInitialValues = {
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }],
  };

  const handleRecipeFormSubmit = async (values, setFormError) => {
    try {
      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('token');

      // Replace 'http://localhost:3000/recipes' with your actual backend endpoint
      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the Authorization header with the token if your endpoint requires authentication
          'Authorization': `Bearer ${token || ''}`, // Securely include the JWT token in the request
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // Convert non-2xx HTTP responses into errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create recipe');
      }

      const recipe = await response.json();
      console.log('Recipe created successfully', recipe);
      // Optionally: Redirect the user or show a success message
    } catch (error) {
      console.error('Failed to create recipe:', error);
      if (setFormError) {
        // Communicate back any error to the form for user feedback
        setFormError(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/user" element={<UserProfile />} />
          <Route path="/add-recipe" element={
  <RecipeForm 
    initialValues={recipeFormInitialValues} 
    onSubmit={handleRecipeFormSubmit} 
  />
} />
          <Route path="/login" element={<Login />} /> {/* Add Login route */}
          <Route path="/register" element={<Registration />} /> {/* Add Registration route */}
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;