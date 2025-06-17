import React, { useEffect, useState } from 'react';
import { useUser } from '../utils/UserContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TraineeDashboard.css';

const TraineeDashboard = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = daysOfWeek[new Date().getDay()];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const profileRes = await axios.get(`http://localhost:5000/api/users/${user.id}`);
        setProfile(profileRes.data);

        const exercisesRes = await axios.get(`http://localhost:5000/api/users/${user.id}/workouts`);
        const allExercises = exercisesRes.data;

        setTodayExercises(allExercises[today] || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user, today]);

  if (loading) {
    return <div className="trainee-dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="trainee-dashboard-error">{error}</div>;
  }

  return (
    <div className="trainee-dashboard-container">
      <header className="trainee-dashboard-header">
        <h1>Welcome back, {profile?.name || user?.name || 'Trainee'}!</h1>
      </header>

      <main className="trainee-dashboard-main">
        <section className="trainee-dashboard-card trainee-dashboard-workout-summary">
          <h2>Today's Workout</h2>
          <p className="trainee-dashboard-workout-status">Ready to crush your goals?</p>
          <Link to="/trainee/exercises" className="trainee-dashboard-button">
            Go to Workout Plan
          </Link>
        </section>

        <section className="trainee-dashboard-card trainee-dashboard-exercise-list">
          <h2>Today's Workout</h2>
          {todayExercises.length > 0 ? (
            <ul className="trainee-dashboard-exercises">
              {todayExercises.map((exercise, index) => (
                <li key={index} className="trainee-dashboard-exercise-item">
                  <span className="trainee-dashboard-exercise-icon"></span>
                  <span className="trainee-dashboard-exercise-name">{exercise.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No exercises planned for today.</p>
          )}
        </section>

        <section className="trainee-dashboard-card trainee-dashboard-coach-info">
          <h2>Your Coach is ...</h2>
          <p className="trainee-dashboard-coach-name">{profile?.coach_name || 'N/A'}</p>
        </section>
      </main>
    </div>
  );
};

export default TraineeDashboard;
