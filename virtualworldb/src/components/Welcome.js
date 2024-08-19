import React from 'react';
import {Link} from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to VIRTUAL WORLD B!</h1>
      <p>Please log in to continue.</p>
      <Link className="link" to="/login">Login</Link>
    </div>
  );
}

export default Welcome;
