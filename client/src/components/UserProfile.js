import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Ensure Link is imported here

const UserProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      setNewEmail(user.email);
      // Use Cloudinary URL directly if available, or set a default image path
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
    formData.append('email', newEmail);
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
        setProfileImageUrl(updatedUser.profile_image_path);  // Use the direct Cloudinary URL
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Failed to update profile', error);
        setError('Failed to update profile. Please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="user-profile-container centered-content">
      <h1>User Profile</h1>
      {profileImageUrl && (
        <img src={profileImageUrl} alt="Profile" style={{ width: '200px', height: 'auto' }} className="profile-image" />
      )}
      <p>Email: {newEmail}</p>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-control">
          <label>Update Email:</label>
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} disabled={loading} />
        </div>
        <div className="form-control">
          <label>Profile Image:</label>
          <input type="file" onChange={handleFileChange} disabled={loading} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Update Profile</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="btn btn-secondary" disabled={loading}>Logout</button>
      <Link to="/dashboard" className="btn">Back to Dashboard</Link>
    </div>
  );
};

export default UserProfile;