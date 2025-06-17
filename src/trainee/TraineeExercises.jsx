import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TraineeExercises.css';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function TraineeExercises({ userId }) {
  const [workouts, setWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseDB, setExerciseDB] = useState([]);

    useEffect(() => {
    async function fetchWorkouts() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}/workouts`);
        const workoutData = res.data;

        const dbRes = await axios.get('https://exercisedb.p.rapidapi.com/exercises?limit=1300', {
          headers: {
            'x-rapidapi-key': '913ede5fc5msh7af032301d58484p138028jsnf2b34e55bd24',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        });
        const exerciseData = dbRes.data;
        setExerciseDB(exerciseData);

        const enrichedWorkouts = {};
        for (const day in workoutData) {
          enrichedWorkouts[day] = workoutData[day].map((ex) => {
            const match = exerciseData.find(e => e.name.toLowerCase() === ex.name?.toLowerCase());
            return {
              ...ex,
              gifUrl: match?.gifUrl || null
            };
          });
        }

        setWorkouts(enrichedWorkouts);
      } catch (err) {
        setError('Failed to load your workout plan.');
        setWorkouts({});
      }
      setLoading(false);
    }

    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);


  if (loading) return <div className="te-loading">Loading your workout plan...</div>;
  if (error) return <div className="te-error">{error}</div>;

  return (
    <div className="te-container">
      <h2 className="te-title">Your Weekly Workout Plan</h2>
      <div className="te-grid">
        {daysOfWeek.map(day => (
          <div className="te-card" key={day}>
            <h3 className="te-day">{day}</h3>
            <div className="te-exercise-list">
              {(workouts[day] && workouts[day].length > 0) ? (
                workouts[day]
                  .filter(ex => ex.name)
                  .map((ex, idx) => (
                    <div className="te-exercise" key={idx}>
                      {ex.gifUrl && (
                        <img
                          src={ex.gifUrl}
                          alt={ex.name}
                          className="te-ex-img"
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            marginBottom: '10px'
                          }}
                        />
                      )}
                      <div className="te-ex-info">
                        <div className="te-ex-name"><strong>{ex.name}</strong></div>
                        <div className="te-ex-body">Body Part: {ex.body_part}</div>
                        <div className="te-ex-equip">Equipment: {ex.equipment}</div>
                        <div className="te-ex-target">Target: {ex.target}</div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="te-empty">No exercises assigned for this day.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
