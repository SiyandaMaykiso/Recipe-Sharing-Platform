// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm'; // Import the RecipeForm component

function App() {
  // Define initial form values for the RecipeForm
  const recipeFormInitialValues = {
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }],
  };

  // Function that submits the form data to your backend
  const handleRecipeFormSubmit = async (values) => {
    try {
      // Make sure to replace 'http://localhost:3000/recipes' with your actual backend endpoint
      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the Authorization header with the token if your endpoint requires authentication
          // 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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
      // Handle successful recipe creation, e.g., redirecting the user or showing a success message
    } catch (error) {
      console.error('Failed to create recipe:', error);
      // Handle errors, e.g., showing an error message to the user
    }
  };

  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/user" component={UserProfile} />
          <Route
            path="/add-recipe"
            render={(props) => (
              <RecipeForm
                {...props}
                initialValues={recipeFormInitialValues}
                onSubmit={handleRecipeFormSubmit}
              />
            )}
          />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
