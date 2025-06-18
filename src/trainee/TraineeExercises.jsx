import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TraineeExercises.css';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function TraineeExercises({ userId }) {
  const [workouts, setWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [exerciseDB, setExerciseDB] = useState([]);

    useEffect(() => {
    async function fetchWorkouts() {
      setLoading(true);

      try {
        const res = await axios.get(`${BASE_URL}/trainee/${userId}/workouts`);
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

        for (let day in workoutData) {
          enrichedWorkouts[day] = workoutData[day].map(function (exercise) {
            const match = exerciseData.find(function (e) {
              return e.name && exercise.name && e.name.toLowerCase() === exercise.name.toLowerCase();
            });

            return {
              ...exercise,
              gifUrl: match ? match.gifUrl : null
            };
          });
        }

        setWorkouts(enrichedWorkouts);
      } catch (err) {
        console.log('Failed to fetch workouts:', err);
        setWorkouts({});
      }

      setLoading(false);
    }

    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);


  if (loading) return <div className="te-loading">Loading your workout plan...</div>;
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
                  .filter(exercise => exercise.name)
                  .map((exercise, idx) => (
                    <div className="te-exercise" key={idx}>
                      {exercise.gifUrl && (
                        <img
                          src={exercise.gifUrl}
                          alt={exercise.name}
                          className="te-ex-img"
                        />
                      )}
                      <div className="te-ex-info">
                        <div className="te-ex-name"><strong>{exercise.name}</strong></div>
                        <div className="te-ex-body">Body Part: {exercise.body_part}</div>
                        <div className="te-ex-equip">Equipment: {exercise.equipment}</div>
                        <div className="te-ex-target">Target: {exercise.target}</div>
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
