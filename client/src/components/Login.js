import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://recipe-sharing-platform-sm-8996552549c5.herokuapp.com/login', {
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

      if (data.token && data.user && data.user.user_id) {
          localStorage.setItem('user', JSON.stringify({
            user_id: data.user.user_id,
            token: data.token,
            email: data.user.email,
            profile_image_path: data.user.profile_image_path
          }));
          navigate('/dashboard');
      } else {
          throw new Error('Login response missing user ID or token');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to login. Please check your credentials.');
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
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
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Login</button>
        {loginError && <div style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>}
      </form>
    </div>
  );
}

export default Login;
