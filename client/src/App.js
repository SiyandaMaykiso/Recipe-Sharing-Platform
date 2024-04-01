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

  // Function that submits the form data to your backend securely
  const handleRecipeFormSubmit = async (values, setFormError) => {
    try {
      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('token');

      // Ensure you replace 'http://localhost:3000/recipes' with your actual backend endpoint
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
      // Optionally: Redirect the user or show a success message here
    } catch (error) {
      console.error('Failed to create recipe:', error);
      if (setFormError) {
        // Communicate back any error to the form for user feedback
        setFormError(error.message || 'An unexpected error occurred. Please try again.');
      }
      // Optionally: Show an error message to the user here
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
                onSubmit={(values, { setSubmitting, setStatus }) => {
                  // Adjusting form submission to handle async operation and error feedback
                  handleRecipeFormSubmit(values, setStatus).finally(() => setSubmitting(false));
                }}
              />
            )}
          />
          {/* Define other routes as needed */}
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
