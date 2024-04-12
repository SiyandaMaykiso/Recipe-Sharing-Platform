
import React from 'react';
import Login from './Login';
import Registration from './Registration';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Recipe Sharing Platform!</h1>
    
      <div className="forms-wrapper"> 
      
        <div className="form-container"> 
          <Login />
        </div>
        <div className="form-container">
          <Registration />
        </div>
      </div>
    </div>
  );
};

export default Home;
