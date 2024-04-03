// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // Sync authToken and currentUser with localStorage
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
      setCurrentUser(data.user); // Update state with the user's information
      setAuthToken(data.token); // Update state with the authentication token
      // Also directly update localStorage to ensure it's immediately available
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear user info from state and local storage
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getAuthHeader = () => {
    // Helper function to get the auth header
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
  };

  const value = {
    currentUser,
    login,
    logout,
    getAuthHeader,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
