import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      setName(data.user.user_metadata.name || '');
      setEmail(data.user.email || '');
      setCity(data.user.user_metadata.city || '');
    };
    getUser();
  }, [navigate]);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { name: name, city: city }
    });
    if (!error) {
      setSuccess('Profile updated successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-box">

        <div className="profile-avatar">
          <span>{name ? name.charAt(0).toUpperCase() : '?'}</span>
        </div>

        <h1>My Profile</h1>
        <p>Manage your Nivaora account</p>

        {success && <p className="success-msg">{success}</p>}

        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="disabled-input"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city"
            />
          </div>

          <button onClick={handleUpdate} className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <button onClick={() => navigate('/dashboard')} className="btn-back">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;