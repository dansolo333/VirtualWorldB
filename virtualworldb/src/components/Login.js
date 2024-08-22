import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUsername }) {
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://virtualworldb-server.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputValue, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('username', inputValue);  // Save username to localStorage
        setUsername(inputValue);
        navigate('/home');
      } else {
        setError(data.detail);
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };
  

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input id='username_input'
        type="text"
        placeholder="Enter username"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <input id='password_input'
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
