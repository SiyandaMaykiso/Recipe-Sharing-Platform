// src/components/Registration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection after successful registration

function Registration() {
  // State to store the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Optionally, state to store any registration error messages
  const [registrationError, setRegistrationError] = useState('');

  const navigate = useNavigate(); // Initialize navigate function for redirection

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from causing a page reload

    try {
      // Make sure this URL matches your backend endpoint for registration
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        // If registration is not successful, throw an error with the response's status text or a custom message
        throw new Error(response.statusText || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      // Redirect to login page or home page after successful registration
      navigate('/login'); // Adjust as needed based on your application's routes
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError('Failed to register. Please try again.'); // Update the UI to show an error message
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <button type="submit">Register</button>
        {registrationError && <div style={{ color: 'red' }}>{registrationError}</div>}
      </form>
    </div>
  );
}

export default Registration;
