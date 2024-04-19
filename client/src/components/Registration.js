import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting registration data:', { username, email, password });

    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });
    
      if (!response.ok) {
        throw new Error(response.statusText || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      
      if (data.user && data.token) {
        setUserAndToken(data.user, data.token); 
        navigate('/dashboard'); 
      } else {
        console.error('User details or token not provided in registration response');
        setRegistrationError('Failed to complete registration.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('Failed to register. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '4px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '4px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '4px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Register</button>
        {registrationError && <div style={{ color: 'red', marginTop: '10px' }}>{registrationError}</div>}
      </form>
    </div>
  );
}

export default Registration;
