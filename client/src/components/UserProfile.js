import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      setEmail(user.email);
      const imageUrl = user.profile_image_path ? user.profile_image_path : '/path/to/default/profileImage';
      setProfileImageUrl(imageUrl);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    setProfileImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;

    const formData = new FormData();
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUserResponse = await response.json();
      const updatedUser = { ...updatedUserResponse.user, token: user.token };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileImageUrl(`http://localhost:3000/${updatedUser.profile_image_path}`);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container centered-content" style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h1 style={{ textAlign: 'center' }}>User Profile</h1>
      {profileImageUrl && (
        <img src={profileImageUrl} alt="Profile" style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '300px', margin: '20px auto', display: 'block' }} className="profile-image" />
      )}
      <p style={{ margin: '10px 0', textAlign: 'center' }}>Email: {email}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="form-control">
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} disabled={loading} style={{ padding: '10px', margin: '10px 0' }} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white' }}>Update Profile</button>
      </form>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn btn-secondary" disabled={loading} style={{ marginRight: '10px' }}>Logout</button>
        <Link to="/dashboard" className="btn" style={{ backgroundColor: '#f0f0f0', color: '#333', textDecoration: 'none', padding: '10px 20px', borderRadius: '5px' }}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default UserProfile;