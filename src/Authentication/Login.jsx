import React, { useState } from 'react';
import './Login.css';
import loginImg from '../Images/loginImg.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const res = await axios.post('http://localhost:5000/api/authentication', user);
      console.log('Login success:', res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo-row">
          <div className="login-logo-placeholder">40 × 40</div>
          <h1 className="login-logo-text">TrainMate</h1>
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue your training journey</p>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-options-row">
            <label className="login-remember">
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <a href="#" className="login-forgot">Forgot password?</a>
          </div>

          <button type="submit" className="login-signin-btn">Sign in</button>
        </form>
        <div className="login-signup-row">
          <h1>Don't have an account?</h1>
          <Link to="/signup" className="login-signup-link">Sign up</Link>
        </div>
      </div>
      <div className="login-right">
        <img src={loginImg} className="login-image" alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
