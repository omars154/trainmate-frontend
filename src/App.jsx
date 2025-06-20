import { useUser } from './utils/UserContext';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import TraineeExercises from './trainee/TraineeExercises';
import ManagingTrainees from './Trainer/ManagingTrainees';
import Profile from './shared/Profile';
import TrainerDashboard from './Trainer/TrainerDashboard';
import TraineeDashboard from './trainee/TraineeDashboard';
import TrainerNav from './Trainer/TrainerNav';
import TraineeNav from './trainee/TraineeNav';
import Footer from './shared/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useUser();
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {user?.role === 'trainee' && <TraineeNav />}
      {user?.role === 'trainer' && <TrainerNav />}

      <main className="app-main">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/manage-trainees"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <ManagingTrainees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/manage-exercises"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <div>Trainer - Manage Exercises (To be implemented)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/manage-diet"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <div>Trainer - Manage Diet (To be implemented)</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['trainee']}>
                <TraineeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainee/exercises"
            element={
              <ProtectedRoute allowedRoles={['trainee']}>
                <TraineeExercises userId={user?.id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainee/diet"
            element={
              <ProtectedRoute allowedRoles={['trainee']}>
                <div>Trainee - Diet Plan (To be implemented)</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['trainer', 'trainee']}>
                <Profile userId={user?.id} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              user ? (
                <Navigate to={user.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard'} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'trainer' ? '/trainer/dashboard' : '/trainee/dashboard'} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
