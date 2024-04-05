import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function Login() {
  const navigate = useNavigate(); // Initialize navigate function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error(response.statusText || 'Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save the token
      localStorage.setItem('user', JSON.stringify(data.user)); // Save user data
  
      // Check if data.user actually contains user_id and save it
      if (data.user && data.user.user_id) {
        localStorage.setItem('user_id', data.user.user_id);
      } else {
        console.error('User ID not found in login response');
      }
  
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      </form>
    </div>
  );
}

export default Login;
