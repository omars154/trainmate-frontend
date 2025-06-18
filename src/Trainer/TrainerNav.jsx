import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import './TrainerNav.css';

const TrainerNav = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <div className="logo-placeholder"></div>
        <span>TrainMate</span>
      </div>
      <div className="nav-links">
        <Link to="/trainer/dashboard">Dashboard</Link>
        <Link to="/trainer/manage-trainees">Manage Trainees</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default TrainerNav; 