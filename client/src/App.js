import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import Home from './components/Home';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import RecipeDetail from './components/RecipeDetail';
import RecipeListings from './components/RecipeListings';


function PrivateRoute({ children }) {
  const { authToken } = useAuth();
  return authToken ? children : <Navigate to="/login-page" />;
}

function App() {
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/user" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/add-recipe" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
          <Route path="/login-page" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/view-recipe" element={<PrivateRoute><RecipeListings /></PrivateRoute>} />
          <Route path="/recipe-detail/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
