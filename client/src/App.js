import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import RecipeDetail from './components/RecipeDetail';
import RecipeListings from './components/RecipeListings';

console.log("Starting the application...");

// Helper component for private routes
const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();
  return authToken ? children : <Navigate to="/login" />;
};

function App() {
  const { authToken } = useAuth(); // Assuming useAuth is exported correctly and can be used here

  const recipeFormInitialValues = {
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }],
  };

  const handleRecipeFormSubmit = async (values, setFormError) => {
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || ''}`, // Use authToken from context
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create recipe');
      }

      const recipe = await response.json();
      console.log('Recipe created successfully', recipe);
    } catch (error) {
      console.error('Failed to create recipe:', error);
      if (setFormError) {
        setFormError(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/user" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/add-recipe" element={<PrivateRoute><RecipeForm initialValues={recipeFormInitialValues} onSubmit={handleRecipeFormSubmit} /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/recipes" element={<PrivateRoute><RecipeListings /></PrivateRoute>} />
          <Route path="/recipes/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
