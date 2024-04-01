// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  // Directly initialize authToken from localStorage, if available
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // Update localStorage when authToken or currentUser changes
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [authToken, currentUser]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const data = await response.json();
      setCurrentUser(data.user); // Assuming the backend returns the user's data and token
      setAuthToken(data.token); // Store the token in state and localStorage is handled by useEffect
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Function to construct auth header with the token
  const getAuthHeader = () => {
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
  };

  const value = {
    currentUser,
    login,
    logout,
    getAuthHeader, // Include getAuthHeader to provide Authorization headers for authenticated requests
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
