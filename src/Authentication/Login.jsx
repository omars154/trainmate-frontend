import React, { useState } from 'react';
import './Login.css';
import loginImg from '../Images/loginImg.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../utils/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/users/by-email/${encodeURIComponent(email)}`);
      const user = res.data;
  
      if (user.password !== password) {
        alert('Invalid credentials');
        return;
      }
  
      // Save user info locally
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', user.name); // ← Add this after login success

      setUser({
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      });

  
      alert('Login successful!');
  
      // Redirect based on role
      if (user.role === 'trainee') {
        navigate('/trainee/dashboard');
      } else if (user.role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: User not found or server error.');
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
            <Link to="#" className="login-forgot">Forgot password?</Link>
          </div>
          <button type="submit" className="login-signin-btn">Sign in</button>
        </form>
        <div className="login-signup-row">
          <span>Don't have an account?</span>
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
