import React from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-logo-row">
          <div className="signup-logo-placeholder">40 × 40</div>
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

          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        <div className="signup-signin-row">
          <span>Already have an account?</span>
          <Link to="/" className="signup-signin-link">Sign in</Link>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-image-card">
          <div className="signup-image-placeholder">420 × 280</div>
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

export default Signup; 