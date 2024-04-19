import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import RecipeDetail from './components/RecipeDetail';
import RecipeListings from './components/RecipeListings';

console.log("Starting the application...");

function App() {
  const recipeFormInitialValues = {
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }],
  };

  const handleRecipeFormSubmit = async (values, setFormError) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
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
          <Route path="/user" element={<UserProfile />} />
          <Route path="/add-recipe" element={<RecipeForm initialValues={recipeFormInitialValues} onSubmit={handleRecipeFormSubmit} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes" element={<RecipeListings />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
