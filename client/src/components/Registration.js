import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Correct relative path from components to contexts

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();  // Destructure setUserAndToken from the context

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting registration data:', { username, email, password });

    try {
      const response = await fetch('http://localhost:3000/register', {
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

      // Set user and token in auth context and local storage
      if (data.user && data.token) {
        setUserAndToken(data.user, data.token);  // Update AuthContext state
        navigate('/dashboard');  // Navigate to dashboard after setting the user and token
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
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Register</button>
        {registrationError && <div style={{ color: 'red' }}>{registrationError}</div>}
      </form>
    </div>
  );
}

export default Registration;