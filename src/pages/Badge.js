import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/Badges.css';

const ALL_BADGES = [
  { id: 'first_login', icon: '🏅', name: 'First Login', desc: 'Logged in for the first time!', color: '#f5a623' },
  { id: 'first_design', icon: '🎨', name: 'First Design', desc: 'Saved your first design!', color: '#2196f3' },
  { id: 'decor_explorer', icon: '🏠', name: 'Decor Explorer', desc: 'Used Decor Ideas feature!', color: '#4caf50' },
  { id: 'budget_master', icon: '💰', name: 'Budget Master', desc: 'Created a budget plan!', color: '#9c27b0' },
  { id: 'vastu_follower', icon: '🕉️', name: 'Vastu Follower', desc: 'Checked Vastu Guide!', color: '#ff5722' },
  { id: 'waste_warrior', icon: '♻️', name: 'Waste Warrior', desc: 'Used Waste to Decor!', color: '#009688' },
  { id: 'photo_pro', icon: '📸', name: 'Photo Pro', desc: 'Analyzed a room photo!', color: '#e91e63' },
  { id: 'floor_planner', icon: '🗺️', name: 'Floor Planner', desc: 'Drew a floor plan!', color: '#795548' },
  { id: 'community_star', icon: '🌐', name: 'Community Star', desc: 'Shared in community!', color: '#3f51b5' },
  { id: 'color_picker', icon: '🎨', name: 'Color Picker', desc: 'Used Wall Color Visualizer!', color: '#ff9800' },
  { id: 'progress_tracker', icon: '📊', name: 'Progress Tracker', desc: 'Tracked home progress!', color: '#607d8b' },
  { id: 'home_planner', icon: '🏗️', name: 'Home Planner', desc: 'Planned your home!', color: '#8bc34a' },
];

function Badges() {
  const navigate = useNavigate();
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/login'); return; }

      const { data } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userData.user.id);

      setEarnedBadges((data || []).map(b => b.badge_id));
      setLoading(false);
    };
    fetchBadges();
  }, [navigate]);

  const earnedCount = earnedBadges.length;
  const totalCount = ALL_BADGES.length;
  const percentage = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="badges-container">
      <div className="badges-box">
        <h1>Achievement Badges 🏆</h1>
        <p>Explore Nivaora and unlock all badges!</p>

        {/* Progress */}
        <div className="badges-progress">
          <div className="badges-progress-info">
            <span>🏆 {earnedCount} / {totalCount} Badges Earned</span>
            <span>{percentage}%</span>
          </div>
          <div className="badges-progress-bar">
            <div className="badges-progress-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {loading && <p className="loading">Loading badges...</p>}

        {/* Badges Grid */}
        <div className="badges-grid">
          {ALL_BADGES.map((badge, i) => {
            const earned = earnedBadges.includes(badge.id);
            return (
              <div key={i} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                <div className="badge-icon-wrap" style={{ background: earned ? badge.color : '#e0e0e0' }}>
                  <span className="badge-icon">{earned ? badge.icon : '🔒'}</span>
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.desc}</p>
                {earned && <span className="badge-earned-label">✅ Earned!</span>}
              </div>
            );
          })}
        </div>

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Badges;
