import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Wallcolor.css';
import { earnBadge } from '../utils/badgeHelper';

function Wallcolor() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [wallColor, setWallColor] = useState('#f5e6d3');
  const [accentColor, setAccentColor] = useState('#8bc34a');

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Pooja Room'];

  const presetColors = [
    '#f5e6d3', '#ffccbc', '#f8bbd0', '#e1bee7',
    '#bbdefb', '#c8e6c9', '#fff9c4', '#ffe0b2',
    '#f0f4c3', '#ffffff', '#e0e0e0', '#795548',
    '#f5a623', '#e53935', '#2196f3', '#4caf50',
  ];

  useEffect(() => {
    earnBadge('color_picker', 'Color Picker', '🎨');
  }, []);

  const getRoomEmoji = (room) => {
    const emojis = {
      'Living Room': '🛋️',
      'Bedroom': '🛏️',
      'Kitchen': '🍳',
      'Bathroom': '🚿',
      'Balcony': '🌿',
      'Pooja Room': '🕉️',
    };
    return emojis[room] || '🏠';
  };

  return (
    <div className="wall-container">
      <div className="wall-box">
        <h1>Wall Color Visualizer 🎨</h1>
        <p>See how your wall colors look before painting!</p>

        <div className="select-group">
          <h3>Select Room:</h3>
          <div className="options-grid">
            {rooms.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelectedRoom(r)}
                className={`option-btn ${selectedRoom === r ? 'selected' : ''}`}
              >
                {getRoomEmoji(r)} {r}
              </button>
            ))}
          </div>
        </div>

        <div className="color-pickers-row">
          <div className="color-pick-group">
            <h3>🎨 Wall Color:</h3>
            <div className="preset-colors">
              {presetColors.map((c, i) => (
                <button
                  key={i}
                  className={`color-swatch ${wallColor === c ? 'selected-swatch' : ''}`}
                  style={{ background: c }}
                  onClick={() => setWallColor(c)}
                />
              ))}
            </div>
            <div className="custom-color">
              <label>Custom:</label>
              <input
                type="color"
                value={wallColor}
                onChange={(e) => setWallColor(e.target.value)}
                className="color-input"
              />
              <span>{wallColor}</span>
            </div>
          </div>

          <div className="color-pick-group">
            <h3>🪑 Accent Color:</h3>
            <div className="preset-colors">
              {presetColors.map((c, i) => (
                <button
                  key={i}
                  className={`color-swatch ${accentColor === c ? 'selected-swatch' : ''}`}
                  style={{ background: c }}
                  onClick={() => setAccentColor(c)}
                />
              ))}
            </div>
            <div className="custom-color">
              <label>Custom:</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="color-input"
              />
              <span>{accentColor}</span>
            </div>
          </div>
        </div>

        <div className="room-preview" style={{ background: wallColor }}>
          <div className="room-floor" />
          <div className="room-ceiling" style={{ background: accentColor }} />
          <div className="room-left-wall" style={{ background: wallColor }} />
          <div className="room-right-wall" style={{ background: wallColor }} />
          <div className="room-content">
            <span className="room-emoji">{getRoomEmoji(selectedRoom)}</span>
            <p className="room-label">{selectedRoom}</p>
            <p className="room-color-label">Wall: {wallColor} | Accent: {accentColor}</p>
          </div>
          <div className="furniture-bar" style={{ background: accentColor }} />
        </div>

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Wallcolor;