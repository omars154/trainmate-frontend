import { Link, useNavigate} from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import './TraineeNav.css';

const TraineeNav = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <div className="logo-placeholder">40 × 40</div>
        <span>TrainMate</span>
      </div>
      <div className="nav-links">
        <Link to="/trainee/dashboard">Dashboard</Link>
        <Link to="/trainee/exercises">Workouts</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default TraineeNav; 