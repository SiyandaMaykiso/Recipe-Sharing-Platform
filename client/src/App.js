import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard'; // Make sure this line is added to import the Dashboard
import RecipeDetail from './components/RecipeDetail'; // Import your RecipeDetail component
import RecipeListings from './components/RecipeListings'; // Import the component

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
          <Route path="/add-recipe" element={<RecipeForm initialValues={recipeFormInitialValues} onSubmit={handleRecipeFormSubmit} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Add this line for the Dashboard route */}
          <Route path="/recipes" element={<RecipeListings />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;