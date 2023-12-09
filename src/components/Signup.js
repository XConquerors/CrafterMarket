import React, { useState } from 'react';

function Signup({ handleSignup, error, message }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupClick = () => {
    handleSignup(username, password); // Call the handleSignup function with username and password
  };

  return (
    <div className="login-signup-container">
      <h2>Signup</h2>
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
      <button onClick={handleSignupClick}>Signup</button>
      {error && <p className="error">{error}</p>}
      <p>{message}</p>
    </div>
  );
}

export default Signup;
