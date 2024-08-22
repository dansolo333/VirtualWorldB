import React from 'react';
import {Link} from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Welcome to VIRTUAL WORLD B!</h1>
      <p>Please <Link className="link" to="/login">Login</Link> to continue or <Link className="link" to="/login">Login</Link>.</p>
    </div>
  );
}

export default Welcome;
