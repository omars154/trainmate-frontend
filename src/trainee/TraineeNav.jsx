import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import './TraineeNav.css';

const TraineeNav = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <div className="logo-placeholder">40 × 40</div>
        <span>TrainMate</span>
      </div>
      <div className="nav-links">
        <Link to="/trainee/dashboard" className={location.pathname === '/trainee/dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/trainee/exercises" className={location.pathname === '/trainee/exercises' ? 'active' : ''}>Workouts</Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
      </div>
      <div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default TraineeNav; 