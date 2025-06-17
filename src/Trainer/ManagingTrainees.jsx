import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagingTrainees.css';
import { useUser } from '../utils/UserContext';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ManagingTrainees() {
  const { user } = useUser();
  const location = useLocation();

  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [traineeWorkouts, setTraineeWorkouts] = useState({});
  const [loadingTrainees, setLoadingTrainees] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const traineeIdFromUrl = queryParams.get('trainee');

    const fetchCoachTrainees = async () => {
      setLoadingTrainees(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/${user?.id}/users`);
        const fetchedTrainees = response.data;
        setTrainees(fetchedTrainees);
        const firstTrainee = traineeIdFromUrl
          ? fetchedTrainees.find(trainee => trainee.id === traineeIdFromUrl)
          : fetchedTrainees[0];
        if (firstTrainee) handleSelectTrainee(firstTrainee);
      } catch (err) {
        console.log('Error fetching coach trainees:', err);
      } finally {
        setLoadingTrainees(false);
      }
    };

    if (user?.id) fetchCoachTrainees();
  }, [user?.id, location.search]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      setLoadingExercises(true);
      try {
        const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises?limit=1300', {
          headers: {
            'x-rapidapi-key': '913ede5fc5msh7af032301d58484p138028jsnf2b34e55bd24',
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        });
        setAllExercises(response.data);
      } catch (error) {
        console.log('Error fetching exercises:', error);
      } finally {
        setLoadingExercises(false);
      }
    };
    fetchAllExercises();
  }, []);

  const fetchTraineeWorkouts = async (traineeId) => {
    setLoadingExercises(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${traineeId}/workouts`);
      const workoutsByDay = response.data;
      daysOfWeek.forEach(day => {
        if (!workoutsByDay[day]) workoutsByDay[day] = [];
      });
      setTraineeWorkouts(prev => ({ ...prev, [traineeId]: workoutsByDay }));
    } catch {
      const emptyWorkouts = Object.fromEntries(daysOfWeek.map(day => [day, []]));
      setTraineeWorkouts(prev => ({ ...prev, [traineeId]: emptyWorkouts }));
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSelectTrainee = async (trainee) => {
    setSelectedTrainee(trainee);
    setSelectedDay('sunday');
    if (!traineeWorkouts[trainee.id]) await fetchTraineeWorkouts(trainee.id);
  };

  const handleAddExercise = async (exercise) => {
    if (!selectedTrainee || !selectedDay) return;

    const newWorkout = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      target: exercise.target
    };

    try {
      setLoadingExercises(true);
      const res = await axios.post(`${API_BASE_URL}/users/${selectedTrainee.id}/workouts/${selectedDay}/exercises`, newWorkout);
      const saved = res.data;

      setTraineeWorkouts(prev => ({
        ...prev,
        [selectedTrainee.id]: {
          ...prev[selectedTrainee.id],
          [selectedDay]: [...(prev[selectedTrainee.id]?.[selectedDay] || []), saved]
        }
      }));
    } catch (error) {
      console.log('Error adding exercise:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleRemoveExercise = async (exerciseIndex) => {
    if (!selectedTrainee || !selectedDay) return;

    const toRemove = traineeWorkouts[selectedTrainee.id]?.[selectedDay]?.[exerciseIndex];
    const exerciseId = toRemove?.id;

    try {
      setLoadingExercises(true);
      await axios.delete(`${API_BASE_URL}/users/${selectedTrainee.id}/workouts/${selectedDay}/exercises/${exerciseId}`);
      setTraineeWorkouts(prev => ({
        ...prev,
        [selectedTrainee.id]: {
          ...prev[selectedTrainee.id],
          [selectedDay]: prev[selectedTrainee.id][selectedDay].filter((_, i) => i !== exerciseIndex)
        }
      }));
    } catch (error) {
      console.log('Error removing exercise:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  const currentDayWorkouts = selectedTrainee && selectedDay
    ? traineeWorkouts[selectedTrainee.id]?.[selectedDay] || []
    : [];

  const filteredExercises = allExercises.filter(exerciseItem =>
    exerciseItem.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="mt-container">
      <h1 className="mt-title">Trainee Management</h1>
      <main className="mt-main-content">
        <div className="mt-left-panel">
          <div className="mt-panel-header"><h3>Trainees</h3></div>
          {loadingTrainees ? (
            <div className="mt-loading">Loading trainees...</div>
          ) : (
            <div className="mt-trainee-list">
              {trainees.map((t) => (
                <div key={t.id}
                  className={`mt-trainee-item ${selectedTrainee?.id === t.id ? 'selected' : ''}`}
                  onClick={() => handleSelectTrainee(t)}>
                  <div className="mt-avatar" style={{ background: t.color || '#6c3ef5' }}>{t.name[0]}</div>
                  <div className="mt-trainee-info">
                    <div className="mt-trainee-name">{t.name}</div>
                    <div className="mt-trainee-age">Age: {t.age}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTrainee && (
          <div className="mt-right-panel">
            <div className="mt-panel-header">
              <div className="mt-avatar-lg" style={{ background: selectedTrainee.color || '#6c3ef5' }}>{selectedTrainee.name[0]}</div>
              <div className="mt-trainee-details-header">
                <div className="mt-trainee-name-lg">{selectedTrainee.name}</div>
                <div className="mt-trainee-age-lg">Age: {selectedTrainee.age}</div>
              </div>
              <button className="mt-close-btn" onClick={() => setSelectedTrainee(null)}>×</button>
            </div>

            <div className="mt-days-selector">
              {daysOfWeek.map(day => (
                <button key={day}
                  className={`mt-day-button ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(day)}>{day}
                </button>
              ))}
            </div>

            {selectedDay && (
              <div className="mt-daily-content">
                <div className="mt-search-section">
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="mt-search-bar"
                  />
                  {loadingExercises ? (
                    <div className="mt-loading">Loading exercises...</div>
                  ) : (
                    <div className="mt-exercise-results">
                      {filteredExercises.length > 0 ? (
                        filteredExercises.slice(0, 7).map(ex => (
                          <div key={ex.id || ex.name}
                            className="mt-exercise-item-search"
                            onClick={() => handleAddExercise(ex)}>
                            <img src={ex.gifUrl} alt={ex.name} className="mt-exercise-img" />
                            <div className="mt-exercise-info-search">
                              <div className="mt-exercise-name-search">{ex.name}</div>
                              <div className="mt-exercise-bodypart-search">{ex.bodyPart}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="mt-empty-results">No exercises found.</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-current-exercises">
                  <div className="mt-current-exercises-header"><h4>Workout Plan for {selectedDay}</h4></div>
                  {currentDayWorkouts.length > 0 ? (
                    <ul className="mt-current-exercise-list">
                      {currentDayWorkouts.map((exercise, index) => {
                        const match = allExercises.find(e => e.name.toLowerCase() === exercise.name?.toLowerCase());
                        return {
                          ...exercise,
                          gifUrl: match?.gifUrl
                        };
                      }).map((exercise, index) => (
                        <li key={index} className="mt-current-exercise-item">
                          <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            className="mt-exercise-img"
                          />
                          <div className="mt-current-exercise-info">
                            <div className="mt-current-exercise-name">{exercise.name}</div>
                            <div className="mt-current-exercise-details">
                              {exercise.bodyPart} - {exercise.equipment}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveExercise(index)}
                            className="mt-remove-btn"
                          >×</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-empty-results">No exercises assigned for {selectedDay}.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagingTrainees;
