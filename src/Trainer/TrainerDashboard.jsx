import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import './TrainerDashboard.css';

const API_BASE_URL = 'http://localhost:5000/api';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const TrainerDashboard = () => {
  const { user } = useUser();
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/${user?.id}/users`);
        setTrainees(response.data);
      } catch (err) {
        setError('Failed to fetch trainees.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchTrainees();
  }, [user?.id]);

  return (
    <div className="tdb-container">
      <main className="tdb-main">
        <h1 className="tdb-welcome">
          Welcome back,<span className="tdb-accent">Coach {user?.name || ''}!</span>
        </h1>
        <div className="tdb-cards-row">
          <div className="tdb-card tdb-total-card">
            <div className="tdb-card-icon">
              <span role="img" aria-label="trainees">👥</span>
            </div>
            <div className="tdb-card-content">
              <div className="tdb-card-number">{trainees.length}</div>
              <div className="tdb-card-label">trainees</div>
            </div>
          </div>
        </div>
        <div className="tdb-list-card">
          <div className="tdb-list-header">
            <span>Your Trainees</span>
            <Link to="/trainer/manage-trainees" className="tdb-view-all">View All</Link>
          </div>
          {loading ? (
            <div className="tdb-loading">Loading...</div>
          ) : error ? (
            <div className="tdb-error">{error}</div>
          ) : (
            <ul className="tdb-trainee-list">
              {trainees.map((t) => (
                <li className="tdb-trainee-item" key={t.id}>
                  <div className="tdb-avatar" style={{ background: t.color || '#6c3ef5' }}>
                    {getInitials(t.name)}
                  </div>
                  <div className="tdb-trainee-info">
                    <div className="tdb-trainee-name">{t.name}</div>
                    <div className="tdb-trainee-date">Last workout: {t.lastWorkout || 'N/A'}</div>
                  </div>
                  <Link to={`/trainer/manage-trainees?trainee=${t.id}`} className="tdb-view-btn">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;
