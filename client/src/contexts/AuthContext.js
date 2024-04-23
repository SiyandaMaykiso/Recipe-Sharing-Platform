import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Export the AuthContext for use in components that consume the context directly
export const AuthContext = createContext(null);

// Export a hook for easy use of the context
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);  // Ensures we don't flash screens during load

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setCurrentUser(storedUser);
      setAuthToken(storedToken);
    }
    setLoading(false);  // Always set loading to false after initial check
  }, []);

  // Persist user and token changes to localStorage
  useEffect(() => {
    if (currentUser && authToken) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('token', authToken);
    }
  }, [currentUser, authToken]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Failed to log in');

      const data = await response.json();
      setCurrentUser(data.user);
      setAuthToken(data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error('Failed to register');

      const data = await response.json();
      setCurrentUser(data.user);
      setAuthToken(data.token);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
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
    return { 'Authorization': `Bearer ${authToken}` };
  };

  const updateProfile = async (formData) => {
    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/user/profile', {
        method: 'PUT',
        headers: getAuthHeader(),
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    authToken,
    loading,
    login,
    logout,
    register,
    getAuthHeader,
    updateProfile,
    setUserAndToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
