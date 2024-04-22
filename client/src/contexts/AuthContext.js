import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setCurrentUser(storedUser);
        setAuthToken(storedToken);
      } else {
        logout(); // Cleanup state if no valid user or token is found
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
  }, [currentUser, authToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/login', {
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
      setCurrentUser(data.user);
      setAuthToken(data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAuthToken('');
  };

  const setUserAndToken = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const getAuthHeader = () => {
    return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
  };

  const updateProfile = async (formData) => {
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    getAuthHeader,
    updateProfile,
    setUserAndToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
