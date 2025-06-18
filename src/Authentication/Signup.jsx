<<<<<<< HEAD
import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupImg from '../Images/SignUpImg.png';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('trainee');
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!agree) {
      alert('You must agree to the terms and privacy policy');
      return;
    }
    try {
      const endpoint = role === 'trainee' ? BASE_URL + '/auth/trainee/register': BASE_URL + '/auth/trainer/register';

      const res = await axios.post(endpoint, {
        name,
        email,
        password,
      });

      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      alert('Signup failed. Check console.');
    }
  };

=======
import React from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
>>>>>>> origin/main
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-logo-row">
          <div className="signup-logo-placeholder">40 × 40</div>
<<<<<<< HEAD
          <h1 className="signup-logo-text">TrainMate</h1>
        </div>
        <h1 className="signup-title">Create your account</h1>
        <p className="signup-subtitle">Join thousands of coaches and trainees on the platform</p>
        <form className="signup-form" onSubmit={handleSignup}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ display: 'none' }}>
            <option value="trainee">Trainee</option>
            <option value="trainer">Trainer</option>
          </select>
          <div className="signup-terms-row">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <label htmlFor="agree" className="signup-terms-label">
              I agree to the <a href="#" className="signup-link">Terms of Service</a>
              and <a href="#" className="signup-link">Privacy Policy</a>
            </label>
          </div>
=======
          <span className="signup-logo-text">TrainMate</span>
        </div>
        <h1 className="signup-title">Create your account</h1>
        <p className="signup-subtitle">Join thousands of coaches and trainees on the platform</p>
        <form className="signup-form">
          <label htmlFor="fullname">Full Name</label>
          <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required />

          <div className="signup-terms-row">
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms" className="signup-terms-label">
              I agree to the <a href="#" className="signup-link">Terms of Service</a> and <a href="#" className="signup-link">Privacy Policy</a>
            </label>
          </div>

>>>>>>> origin/main
          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        <div className="signup-signin-row">
          <span>Already have an account?</span>
<<<<<<< HEAD
          <Link to="/login" className="signup-signin-link">Sign in</Link>
=======
          <Link to="/" className="signup-signin-link">Sign in</Link>
>>>>>>> origin/main
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-image-card">
<<<<<<< HEAD
          <img src={SignupImg} alt="Signup" className="signup-image" />
=======
          <div className="signup-image-placeholder">420 × 280</div>
>>>>>>> origin/main
          <div className="signup-image-text">
            <div className="signup-image-title">Transform Your Training Journey</div>
            <div className="signup-image-desc">
              Access powerful tools for scheduling, tracking, and communication. Take your training to the next level with TrainMate's comprehensive platform.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Signup;
=======
export default Signup; 
>>>>>>> origin/main
