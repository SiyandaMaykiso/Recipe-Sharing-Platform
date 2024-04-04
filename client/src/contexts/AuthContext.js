import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
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
      setAuthToken(data.token); // **This line uses setAuthToken**
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Logout implementation...
  };

  const getAuthHeader = () => {
    // Helper function to get the auth header
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
  };

  const updateProfile = async (formData) => {
    try {
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // Note: Do not set 'Content-Type' here. Let the browser set it for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser); // Update the currentUser state with the updated data
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Also update local storage
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      throw error; // Let the calling code handle the error
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    getAuthHeader,
    updateProfile, // Make the updateProfile method available to components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
