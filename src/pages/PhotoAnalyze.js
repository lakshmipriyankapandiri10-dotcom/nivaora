import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PhotoAnalyze.css';
import { earnBadge } from '../utils/badgeHelper';

function PhotoAnalyze() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Pooja Room'];
  const styles = ['Modern', 'Traditional', 'Minimalist', 'Bohemian', 'Royal'];

  const analyzePhoto = async () => {
    setLoading(true);
    await earnBadge('photo_pro', 'Photo Pro', '📸');
    const prompt = `You are an expert interior designer. Give detailed improvement suggestions for:
    Room Type: ${roomType}
    Preferred Style: ${style}
    
    Include:
    1. Complete room makeover plan
    2. Top 5 improvement suggestions
    3. Color scheme recommendations
    4. Furniture arrangement tips
    5. Lighting suggestions
    6. Budget estimate in Indian rupees
    7. DIY tips to save money
    Be specific and practical for Indian homes.`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }]
        })
      }
    );
    const data = await response.json();
    setSuggestions(data.choices[0].message.content);
    setLoading(false);
  };

  return (
    <div className="photo-container">
      <div className="photo-box">
        <h1>📸 Room Analyzer</h1>
        <p>Upload your room photo and get AI design suggestions!</p>

        <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
          {preview ? (
            <img src={preview} alt="Room" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <span>📷</span>
              <p>Click to upload room photo</p>
              <small>JPG, PNG supported</small>
            </div>
          )}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        <div className="select-group">
          <h3>Select Room Type:</h3>
          <div className="options-grid">
            {rooms.map((r, i) => (
              <button
                key={i}
                onClick={() => setRoomType(r)}
                className={`option-btn ${roomType === r ? 'selected' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="select-group">
          <h3>Preferred Style:</h3>
          <div className="options-grid">
            {styles.map((s, i) => (
              <button
                key={i}
                onClick={() => setStyle(s)}
                className={`option-btn ${style === s ? 'selected' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {roomType && style && (
          <button onClick={analyzePhoto} className="btn-primary">
            Get Suggestions ✨
          </button>
        )}

        {loading && (
          <div className="loading">
            <p>AI is generating suggestions...</p>
          </div>
        )}

        {suggestions && (
          <div className="suggestions-content">
            <h3>AI Suggestions 🏠</h3>
            <p>{suggestions}</p>
          </div>
        )}

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default PhotoAnalyze;