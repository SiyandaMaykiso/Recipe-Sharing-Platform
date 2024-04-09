import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout, updateProfile, getProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNewEmail(currentUser.email);
      // Assuming the path is stored in currentUser.profileImagePath
      // Adjust the path as needed based on how your backend serves images
      setProfileImageUrl(currentUser.profileImagePath);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      setError('Logout failed. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('email', newEmail);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      await updateProfile(formData); // Ensure you have a method to handle profile update including image
      alert('Profile updated successfully!');
      // Optionally, refetch profile to update UI
      getProfile().then(updatedUser => {
        setProfileImageUrl(updatedUser.profileImagePath);
      });
    } catch (error) {
      console.error('Failed to update profile', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="user-profile-container centered-content">
      <h1>User Profile</h1>
      {profileImageUrl && (
        <img src={profileImageUrl} alt="Profile" className="profile-image" />
      )}
      <p>Email: {currentUser.email}</p>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-control">
          <label>New Email:</label>
          <input type="email"value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={loading} />
        </div>
        <div className="form-control">
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} disabled={loading} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Update Profile</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout} className="btn btn-secondary" disabled={loading}>Logout</button>
      <Link to="/dashboard" className="btn">Back to Dashboard</Link>
    </div>
  );
};

export default UserProfile;
