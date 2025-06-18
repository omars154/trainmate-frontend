import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import './TrainerDashboard.css';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

function TrainerDashboard() {
  const { user } = useUser();
  const [traineeList, setTraineeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainees() {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/trainer/${user?.id}/users`);
        setTraineeList(response.data);
      } catch (error) {
        console.log(error)
      }
      setLoading(false);
    }

    if (user?.id) {
      loadTrainees();
    }
  }, [user?.id]);

  return (
    <div className="tdb-container">
      <main className="tdb-main">
        <h1 className="tdb-welcome">
          Welcome back, <span className="tdb-accent">Coach {user.name}!</span>
        </h1>

        <div className="tdb-cards-row">
          <div className="tdb-card tdb-total-card">
            <div className="tdb-card-icon">
              <span role="img" aria-label="trainees">👥</span>
            </div>
            <div className="tdb-card-content">
              <div className="tdb-card-number">{traineeList.length}</div>
              <div className="tdb-card-label">Trainees</div>
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
          ) : (
            <ul className="tdb-trainee-list">
              {traineeList.map((trainee) => (
                <li className="tdb-trainee-item" key={trainee.id}>
                  <div className="tdb-avatar">👤</div>
                  <div className="tdb-trainee-info">
                    <div className="tdb-trainee-name">{trainee.name}</div>
                    <div className="tdb-trainee-date">Last workout: {trainee.lastWorkout || 'N/A'}</div>
                  </div>
                  <Link to={`/trainer/manage-trainees?trainee=${trainee.id}`} className="tdb-view-btn">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default TrainerDashboard;
