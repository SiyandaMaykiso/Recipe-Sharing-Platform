// src/components/UserProfile.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Additional logout logic like redirecting the user
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
