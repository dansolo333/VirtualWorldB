import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await fetch('https://virtualworldb.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.detail);
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <input id='username_input'
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input id='password_input'
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignUp;
