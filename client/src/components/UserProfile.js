// src/components/UserProfile.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout, updateEmail } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState(currentUser ? currentUser.email : '');

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setError('Logout failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateEmail(newEmail);
      setError('');
      alert('Email updated successfully!');
    } catch (error) {
      console.error('Failed to update email', error);
      setError('Failed to update email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {currentUser.email}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>Update Email</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout} disabled={loading}>Logout</button>
    </div>
  );
};

export default UserProfile;
