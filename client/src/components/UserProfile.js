// src/components/UserProfile.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect the user to the login page after logout
    } catch (error) {
      // Handle potential errors (e.g., failed logout process)
      console.error('Failed to logout', error);
    }
  };

  return (
    <div>
      {currentUser ? (
        <>
          <h1>Welcome, {currentUser.email}</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}

export default UserProfile;
