import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ensure correct path to AuthContext

const UserProfile = () => {
  const { currentUser, authToken, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!currentUser || !authToken) {
      navigate('/login');
    }
  }, [currentUser, authToken, navigate]);

  const handleFileChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      alert('Profile updated successfully!');
      // Assuming you have a method to update currentUser in context
      // updateUser(updatedUser); 
      navigate('/dashboard'); // Refresh or navigate to reflect changes
    } catch (error) {
      console.error('Failed to update profile', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h1>User Profile</h1>
      {currentUser?.profile_image_path && (
        <img src={currentUser.profile_image_path} alt="Profile" style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '300px', margin: '20px auto', display: 'block' }} />
      )}
      <p>Email: {currentUser?.email}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} disabled={loading} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">Update Profile</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '20px' }}>
        <button onClick={logout} className="btn btn-secondary">Logout</button>
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default UserProfile;
