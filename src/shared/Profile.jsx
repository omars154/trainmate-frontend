import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useUser } from '../utils/UserContext';

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) return;

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
        setProfile(res.data);
        setForm(res.data);

        if (res.data.role === 'trainee') {
          const coachRes = await axios.get('http://localhost:5000/api/coaches');
          setCoaches(coachRes.data);
        }
      } catch (err) {
        setError('Failed to load profile.');
      }
      setLoading(false);
    }

    fetchUser();
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(null);
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(profile);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!editMode) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, form);
      setProfile(form);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }

    setSaving(false);
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (!profile) return <div className="profile-error">{error || 'User not found.'}</div>;

  return (
    <div className="profile-page-container">
      <main className="profile-main-content">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-card">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-group">
              <label className="profile-label">Email:</label>
              <span className="profile-display-value">{profile.email}</span>
            </div>

            <div className="profile-group">
              <label className="profile-label">Name:</label>
              {editMode ? (
                <input name="name" value={form.name || ''} onChange={handleChange} className="profile-input" />
              ) : (
                <span className="profile-display-value">{profile.name}</span>
              )}
            </div>

            {profile.role === 'trainee' && (
              <>
                <div className="profile-group">
                  <label className="profile-label">Height (cm):</label>
                  {editMode ? (
                    <input name="height" type="number" value={form.height || ''} onChange={handleChange} className="profile-input" />
                  ) : (
                    <span className="profile-display-value">{profile.height || '- '}</span>
                  )}
                </div>
                <div className="profile-group">
                  <label className="profile-label">Weight (kg):</label>
                  {editMode ? (
                    <input name="weight" type="number" value={form.weight || ''} onChange={handleChange} className="profile-input" />
                  ) : (
                    <span className="profile-display-value">{profile.weight || '- '}</span>
                  )}
                </div>
                <div className="profile-group">
                  <label className="profile-label">Coach:</label>
                  {editMode ? (
                    <select name="coach_id" value={form.coach_id || ''} onChange={handleChange} className="profile-select">
                      <option value="">Select coach</option>
                      {coaches.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="profile-display-value">{profile.coach_name || '- '}</span>
                  )}
                </div>
              </>
            )}

            {profile.role === 'trainer' && (
              <div className="profile-group">
                <label className="profile-label">Phone:</label>
                {editMode ? (
                  <input name="phone" value={form.phone || ''} onChange={handleChange} className="profile-input" />
                ) : (
                  <span className="profile-display-value">{profile.phone || '- '}</span>
                )}
              </div>
            )}

            <div className="profile-actions">
              {editMode ? (
                <>
                  <button type="submit" disabled={saving} className="profile-save-btn">{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={handleCancel} disabled={saving} className="profile-cancel-btn">Cancel</button>
                </>
              ) : (
                <button type="button" onClick={handleEdit} className="profile-edit-btn">Edit Profile</button>
              )}
            </div>

            {error && <div className="profile-message profile-error">{error}</div>}
            {success && <div className="profile-message profile-success">{success}</div>}
          </form>
        </div>
      </main>
    </div>
  );
}
