import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagingTrainees.css';
import { useUser } from '../utils/UserContext';
import { useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export default function ManagingTrainees() {
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const traineeIdFromUrl = queryParams.get('trainee');

    const fetchCoachTrainees = async () => {
      setLoadingTrainees(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/coaches/${user?.id}/users`);
        const fetchedTrainees = response.data.map(t => ({
          ...t,
          age: t.age || 20 + Math.floor(Math.random() * 10),
          color: `#${Math.floor(Math.random()*16777215).toString(16)}` 
        }));
        setTrainees(fetchedTrainees);
        if (traineeIdFromUrl) {
          const preselected = fetchedTrainees.find(t => t.id === traineeIdFromUrl);
          if (preselected) {
            handleSelectTrainee(preselected);
          } else if (fetchedTrainees.length > 0) {
            handleSelectTrainee(fetchedTrainees[0]);
          }
        } else if (fetchedTrainees.length > 0) {
          handleSelectTrainee(fetchedTrainees[0]);
        }

      } catch (err) {
        console.error('Error fetching coach trainees:', err);
        setError('Failed to load trainees. Please try again.');
      } finally {
        setLoadingTrainees(false);
      }
    };

    if (user?.id) {
      fetchCoachTrainees();
    }
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
        console.error('Error fetching exercises:', error);
        setError('Failed to load exercises from external API.');
      } finally {
        setLoadingExercises(false);
      }
    };
    fetchAllExercises();
  }, []);

  const fetchTraineeWorkouts = async (traineeId) => {
    setLoadingExercises(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${traineeId}/workouts`);
      const workoutsByDay = response.data;
      daysOfWeek.forEach(day => {
        if (!workoutsByDay[day]) {
          workoutsByDay[day] = [];
        }
      });

      setTraineeWorkouts(prev => ({
        ...prev,
        [traineeId]: workoutsByDay
      }));
      
    } catch (error) {
      console.warn('No workouts found for trainee, initializing empty. ', error);
      const emptyWorkouts = Object.fromEntries(daysOfWeek.map(day => [day, []]));
      setTraineeWorkouts(prev => ({
        ...prev,
        [traineeId]: emptyWorkouts
      }));
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSelectTrainee = async (trainee) => {
    setSelectedTrainee(trainee);
    setSelectedDay('Monday');
    if (!traineeWorkouts[trainee.id]) {
      await fetchTraineeWorkouts(trainee.id);
    }
  };

  const handleAddExercise = async (exercise) => {
    if (!selectedTrainee || !selectedDay) return;
  
    const newWorkoutExercise = {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    bodyPart: exercise.bodyPart,
    equipment: exercise.equipment,
    target: exercise.target
    };

    try {
      setLoadingExercises(true);
  
      const res = await axios.post(
        `${API_BASE_URL}/users/${selectedTrainee.id}/workouts/${selectedDay}/exercises`,
        newWorkoutExercise
      );
      const savedExercise = res.data;
  
      setTraineeWorkouts(prev => ({
        ...prev,
        [selectedTrainee.id]: {
          ...prev[selectedTrainee.id],
          [selectedDay]: [...(prev[selectedTrainee.id]?.[selectedDay] || []), savedExercise]
        }
      }));
    } catch (error) {
      console.error('Error adding exercise:', error);
      setError('Failed to add exercise.');
    } finally {
      setLoadingExercises(false);
    }
  };  

  const handleRemoveExercise = async (exerciseIndex) => {
    if (!selectedTrainee || !selectedDay) return;

    const exerciseToRemove = traineeWorkouts[selectedTrainee.id]?.[selectedDay]?.[exerciseIndex];
    const exerciseId = exerciseToRemove?.id;


    if (!exerciseId) {
      setError('Could not determine exercise ID for removal.');
      return;
    }

    try {
      setLoadingExercises(true);
      await axios.delete(`${API_BASE_URL}/users/${selectedTrainee.id}/workouts/${selectedDay}/exercises/${exerciseId}`);

      setTraineeWorkouts(prev => ({
        ...prev,
        [selectedTrainee.id]: {
          ...prev[selectedTrainee.id],
          [selectedDay]: prev[selectedTrainee.id][selectedDay].filter((_, idx) => idx !== exerciseIndex)
        }
      }));
    } catch (error) {
      console.error('Error removing exercise:', error);
      setError('Failed to remove exercise.');
    } finally {
      setLoadingExercises(false);
    }
  };

  const currentDayWorkouts = selectedTrainee && selectedDay 
    ? traineeWorkouts[selectedTrainee.id]?.[selectedDay] || [] 
    : [];

  const filteredExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div className="mt-container">
      <h1 className="mt-title">Trainee Management</h1>
      <main className="mt-main-content">
        <div className="mt-left-panel">
          <div className="mt-panel-header">
            <h3>Trainees</h3>
          </div>
          {loadingTrainees ? (
            <div className="mt-loading">Loading trainees...</div>
          ) : error ? (
            <div className="mt-error">{error}</div>
          ) : (
            <div className="mt-trainee-list">
              {trainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className={`mt-trainee-item ${selectedTrainee?.id === trainee.id ? 'selected' : ''}`}
                  onClick={() => handleSelectTrainee(trainee)}
                >
                  <div className="mt-avatar" style={{ background: trainee.color || '#6c3ef5' }}>{getInitials(trainee.name)}</div>
                  <div className="mt-trainee-info">
                    <div className="mt-trainee-name">{trainee.name}</div>
                    <div className="mt-trainee-age">Age: {trainee.age}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTrainee && (
          <div className="mt-right-panel">
            <div className="mt-panel-header">
              <div className="mt-avatar-lg" style={{ background: selectedTrainee.color || '#6c3ef5' }}>{getInitials(selectedTrainee.name)}</div>
              <div className="mt-trainee-details-header">
                <div className="mt-trainee-name-lg">{selectedTrainee.name}</div>
                <div className="mt-trainee-age-lg">Age: {selectedTrainee.age}</div>
              </div>
              <button className="mt-close-btn" onClick={() => setSelectedTrainee(null)}>×</button>
            </div>

            <div className="mt-days-selector">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  className={`mt-day-button ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
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
                  ) : error ? (
                    <div className="mt-error">{error}</div>
                  ) : (
                    <div className="mt-exercise-results">
                      {filteredExercises.length > 0 ? (
                        filteredExercises.slice(0, 7).map(exercise => (
                          <div
                            key={exercise.id || exercise.name}
                            className="mt-exercise-item-search"
                            onClick={() => handleAddExercise(exercise)}
                          >
                            <img src={exercise.gifUrl || 'https://via.placeholder.com/40'} alt={exercise.name} className="mt-exercise-img" />
                            <div className="mt-exercise-info-search">
                              <div className="mt-exercise-name-search">{exercise.name}</div>
                              <div className="mt-exercise-bodypart-search">{exercise.bodyPart}</div>
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
                  <div className="mt-current-exercises-header">
                    <h4>Workout Plan for {selectedDay}</h4>
                  </div>
                   {currentDayWorkouts.length > 0 ? (
                      <ul className="mt-current-exercise-list">
                        {currentDayWorkouts
                          .map((exercise) => {
                            const match = allExercises.find(
                              (e) => e.name.toLowerCase() === exercise.name?.toLowerCase()
                            );
                            return {
                              ...exercise,
                              gifUrl: match?.gifUrl || null
                            };
                          })
                          .map((exercise, index) => (
                            <li key={index} className="mt-current-exercise-item">
                              <img
                                src={exercise.gifUrl || 'https://via.placeholder.com/80'}
                                alt={exercise.name}
                                className="mt-exercise-img"
                                style={{ width: '80px', height: '80px', marginRight: '10px', objectFit: 'contain' }}
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
                              >
                                ×
                              </button>
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
