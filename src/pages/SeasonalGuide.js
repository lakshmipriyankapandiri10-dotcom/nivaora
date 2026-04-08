import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SeasonalGuide.css';

const SEASONS = [
  { id: 'summer', icon: '☀️', label: 'Summer', color: '#ff9800' },
  { id: 'monsoon', icon: '🌧️', label: 'Monsoon', color: '#2196f3' },
  { id: 'winter', icon: '❄️', label: 'Winter', color: '#90caf9' },
  { id: 'diwali', icon: '🪔', label: 'Diwali', color: '#f5a623' },
  { id: 'christmas', icon: '🎄', label: 'Christmas', color: '#4caf50' },
  { id: 'holi', icon: '🎨', label: 'Holi', color: '#e91e63' },
];

function SeasonalGuide() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!city.trim() || !selectedSeason) {
      setError('Please enter your city and select a season!');
      return;
    }
    setError('');
    setLoading(true);
    setGuide(null);

    try {
      const prompt = `You are an expert Indian home decorator. Create a complete seasonal home guide for:
City: ${city}
Season/Festival: ${selectedSeason.label}

Generate in this EXACT format:

COLOR THEME:
Describe the ideal color theme for this season in 2 lines.

5 DECOR IDEAS:
1. Specific decor idea with description
2. Specific decor idea with description
3. Specific decor idea with description
4. Specific decor idea with description
5. Specific decor idea with description

SUITABLE PLANTS:
3 plants perfect for this season with care tips.

LIGHTING SUGGESTIONS:
3 specific lighting ideas for this season.

MAINTENANCE TASKS:
4 home maintenance tasks important for this season in ${city}.

FESTIVAL DECORATIONS:
3 specific decoration ideas unique to ${selectedSeason.label}.

SHOPPING LIST (under ₹500 each):
1. Item name — Where to buy — Price in rupees
2. Item name — Where to buy — Price in rupees
3. Item name — Where to buy — Price in rupees
4. Item name — Where to buy — Price in rupees
5. Item name — Where to buy — Price in rupees

Keep all suggestions practical for Indian homes in ${city}.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500
        })
      });

      const data = await response.json();
      setGuide(data.choices[0].message.content);
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  const formatGuide = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.match(/^[A-Z0-9\s&()]+:$/) || line.match(/^[A-Z][A-Z0-9\s&()]+:$/)) {
        return <h3 key={i} className="sg-section-title">{line}</h3>;
      } else if (line.match(/^\d\./)) {
        return <p key={i} className="sg-item">• {line.replace(/^\d\./, '').trim()}</p>;
      } else if (line.startsWith('- ')) {
        return <p key={i} className="sg-item">• {line.replace(/^- /, '')}</p>;
      } else if (line.trim()) {
        return <p key={i} className="sg-text">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="sg-container">
      <div className="sg-header">
        <button onClick={() => navigate('/dashboard')} className="sg-back-btn">← Back</button>
        <h1>🗓️ Seasonal Home Guide</h1>
        <p>Get home tips, decor ideas and shopping lists for every season and festival!</p>
      </div>

      <div className="sg-content">
        {/* Left */}
        <div className="sg-left">
          <div className="sg-card">
            <h3>🏙️ Your City</h3>
            <input
              type="text"
              placeholder="Enter your city (e.g. Hyderabad)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="sg-input"
            />
          </div>

          <div className="sg-card">
            <h3>🌤️ Select Season or Festival</h3>
            <div className="sg-seasons-grid">
              {SEASONS.map((s) => (
                <button
                  key={s.id}
                  className={`sg-season-btn ${selectedSeason?.id === s.id ? 'active' : ''}`}
                  style={selectedSeason?.id === s.id ? { borderColor: s.color, background: s.color + '22' } : {}}
                  onClick={() => setSelectedSeason(s)}
                >
                  <span className="sg-season-icon">{s.icon}</span>
                  <span className="sg-season-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="sg-error">{error}</p>}

          <button
            className="sg-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            style={selectedSeason ? { background: `linear-gradient(135deg, #2d4a3e, ${selectedSeason.color})` } : {}}
          >
            {loading ? '✨ Generating Guide...' : '✨ Generate Seasonal Guide'}
          </button>
        </div>

        {/* Right */}
        <div className="sg-right">
          {loading && (
            <div className="sg-loading">
              <div className="sg-loading-icon">{selectedSeason?.icon || '🏠'}</div>
              <h3>Creating your seasonal guide...</h3>
              <p>AI is preparing tips for {selectedSeason?.label} in {city}!</p>
            </div>
          )}

          {guide && !loading && (
            <div className="sg-result">
              <div className="sg-result-header" style={{ borderLeft: `4px solid ${selectedSeason?.color}` }}>
                <h2>{selectedSeason?.icon} {selectedSeason?.label} Guide</h2>
                <p>{city} • {selectedSeason?.label} Season</p>
              </div>
              <div className="sg-guide-content">
                {formatGuide(guide)}
              </div>
              <button className="sg-retry-btn" onClick={() => { setGuide(null); setCity(''); setSelectedSeason(null); }}>
                🔄 Try Another Season
              </button>
            </div>
          )}

          {!guide && !loading && (
            <div className="sg-empty">
              <span>🗓️</span>
              <h3>Your seasonal guide will appear here!</h3>
              <p>Select a season or festival and enter your city to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeasonalGuide;