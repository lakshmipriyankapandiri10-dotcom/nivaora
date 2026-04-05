import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProgressTracker.css';

function ProgressTracker() {
  const navigate = useNavigate();
  const [stages, setStages] = useState([
    { id: 1, title: '🏗️ Foundation', desc: 'Laying the foundation and base structure', done: false },
    { id: 2, title: '🧱 Construction', desc: 'Building walls, columns and structure', done: false },
    { id: 3, title: '🪟 Windows & Doors', desc: 'Installing windows, doors and frames', done: false },
    { id: 4, title: '⚡ Electrical & Plumbing', desc: 'Wiring, pipes and fittings', done: false },
    { id: 5, title: '🎨 Plastering & Painting', desc: 'Plastering walls and painting', done: false },
    { id: 6, title: '🪴 Flooring', desc: 'Laying tiles and flooring', done: false },
    { id: 7, title: '🛋️ Interior & Furniture', desc: 'Setting up furniture and decor', done: false },
    { id: 8, title: '✅ Final Touches', desc: 'Cleaning, finishing and moving in!', done: false },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('nivaora_progress');
    if (saved) setStages(JSON.parse(saved));
  }, []);

  const toggleStage = (id) => {
    const updated = stages.map(s => s.id === id ? { ...s, done: !s.done } : s);
    setStages(updated);
    localStorage.setItem('nivaora_progress', JSON.stringify(updated));
  };

  const completed = stages.filter(s => s.done).length;
  const percentage = Math.round((completed / stages.length) * 100);

  return (
    <div className="progress-container">
      <div className="progress-box">
        <h1>📊 Progress Tracker</h1>
        <p>Track your home building journey!</p>

        <div className="progress-summary">
          <div className="progress-circle">
            <span className="progress-percent">{percentage}%</span>
            <span className="progress-label">Complete</span>
          </div>
          <div className="progress-stats">
            <p>✅ {completed} stages done</p>
            <p>⏳ {stages.length - completed} stages remaining</p>
          </div>
        </div>

        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="stages-list">
          {stages.map((s) => (
            <div
              key={s.id}
              className={`stage-item ${s.done ? 'done' : ''}`}
              onClick={() => toggleStage(s.id)}
            >
              <div className="stage-check">
                {s.done ? '✅' : '⭕'}
              </div>
              <div className="stage-info">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ProgressTracker;