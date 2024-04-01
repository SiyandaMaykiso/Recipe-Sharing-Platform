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

  // Define a dummy handleSubmit function for the RecipeForm
  // In a real app, you would replace this with a function that submits the form data to your backend
  const handleRecipeFormSubmit = (values) => {
    console.log('Form values:', values);
    // Add your submission logic here
  };

  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/user" component={UserProfile} />
          {/* Add a new Route for the RecipeForm */}
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
          {/* Define other routes as needed */}
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
