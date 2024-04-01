// In src/components/Home.js
import React from 'react';
import Login from './Login'; // Import the Login component
import Registration from './Registration'; // Import the Registration component

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Recipe Sharing Platform!</h1>
      <div className="forms-container">
        <div className="login-form">
          <Login /> {/* Embed the Login form */}
        </div>
        <div className="registration-form">
          <Registration /> {/* Embed the Registration form */}
        </div>
      </div>
    </div>
  );
};

export default Home;
