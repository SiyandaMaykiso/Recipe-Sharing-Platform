// In src/components/Home.js
import React from 'react';
import Login from './Login'; // Import the Login component
import Registration from './Registration'; // Import the Registration component

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Recipe Sharing Platform!</h1>
      {/* Use "forms-wrapper" as per the CSS */}
      <div className="forms-wrapper"> 
        {/* Use "form-container" for individual forms to apply the CSS correctly */}
        <div className="form-container"> 
          <Login /> {/* Embed the Login form */}
        </div>
        <div className="form-container">
          <Registration /> {/* Embed the Registration form */}
        </div>
      </div>
    </div>
  );
};

export default Home;
