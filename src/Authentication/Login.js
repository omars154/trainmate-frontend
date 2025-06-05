import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo-row">
          <div className="login-logo-placeholder">40 × 40</div>
          <span className="login-logo-text">TrainMate</span>
        </div>
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to continue your training journey</p>
        <form className="login-form">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />

          <div className="login-options-row">
            <label className="login-remember">
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <a href="#" className="login-forgot">Forgot password?</a>
          </div>

          <button type="submit" className="login-signin-btn">Sign in</button>
        </form>
        <div className="login-signup-row">
          <span>Don't have an account?</span>
          <Link to="/signup" className="login-signup-link">Sign up</Link>
        </div>
      </div>
      <div className="login-right">
        <div className="login-image-placeholder">640 × 480</div>
      </div>
    </div>
  );
};

export default Login; 