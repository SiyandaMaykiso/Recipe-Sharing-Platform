import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState(''); // Changed from name to username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the data just before sending it
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
  
      if (data.user && data.token) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user.user_id);
      } else {
        console.error('User details or token not provided in registration response');
      }
  
      navigate('/dashboard');
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