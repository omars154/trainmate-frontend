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
  const [allExercises, setAllExercises] = useState([]);

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
      const allBackendExercises = exercisesRes.data;

      const todayExercisesRaw = allBackendExercises[today] || [];
      const exercisesDBRes = await axios.get('https://exercisedb.p.rapidapi.com/exercises?limit=1300', {
        headers: {
          'x-rapidapi-key': '913ede5fc5msh7af032301d58484p138028jsnf2b34e55bd24',
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      });
      setAllExercises(exercisesDBRes.data);

      const enrichedToday = todayExercisesRaw.map(exercise => ({
      ...exercise,
      gifUrl: exercisesDBRes.data.find(e => e.name.toLowerCase() === exercise.name.toLowerCase()).gifUrl
      }));
      
      setTodayExercises(enrichedToday);
    } catch (err) {
      console.log('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  fetchDashboardData();
}, [user, today]);

  if (loading) {
    return <div className="trainee-dashboard-loading">Loading dashboard...</div>;
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
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="trainee-dashboard-exercise-gif"
                />
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
