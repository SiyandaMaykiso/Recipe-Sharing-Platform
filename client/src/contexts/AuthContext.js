import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Export the AuthContext for use in components that consume the context directly
export const AuthContext = createContext();

// Export a hook for easy use of the context
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('token');
      if (storedUser || storedToken) {
        if (storedUser && storedToken) {
          setCurrentUser(storedUser);
          setAuthToken(storedToken);
        } else {
          if (!storedUser) {
            localStorage.removeItem('user');  // Remove user if no token is present
          }
          if (!storedToken) {
            localStorage.removeItem('token');  // Remove token if no user is present
          }
          logout(); // Cleanup state if no valid user or token is found
        }
      }
    };

    initAuth();
  }, []);

  // Persist user and token changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
    if (authToken) {
      localStorage.setItem('token', authToken);
    } else {
      localStorage.removeItem('token');
    }
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

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  const setUserAndToken = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
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
