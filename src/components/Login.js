import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ handleLogin, error, message }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    handleLogin(username, password); // Call the handleLogin function with username and password
  };

  return (
    <div className="login-signup-container">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLoginClick}>Login</button>
      {error && <p className="error">{error}</p>}
      <p>{message}</p>
      <p>Not registered? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

export default Login;
