import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { name: name } }
      });
      if (error) { setError(error.message); return; }
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        <p>Join Nivaora and start your home journey</p>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup} className="btn-primary">
          Create Account
        </button>
        <p onClick={() => navigate('/login')} className="switch-link">
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Signup;
