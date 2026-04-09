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
  const [images, setImages] = useState([]);

  const fetchImages = async (query) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=3&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`
      );
      const data = await res.json();
      setImages(data.results || []);
    } catch (err) {
      console.log('Image fetch error:', err);
    }
  };

  const handleGenerate = async () => {
    if (!city.trim() || !selectedSeason) {
      setError('Please enter your city and select a season!');
      return;
    }
    setError('');
    setLoading(true);
    setGuide(null);
    setImages([]);

    fetchImages(`${selectedSeason.label} home decoration India`);

    try {
      const prompt = `You are an expert Indian home decorator. Create a complete seasonal home guide for:
City: ${city}
Season/Festival: ${selectedSeason.label}

Generate in this EXACT format:

COLOR THEME:
Describe the ideal color theme for this season in 2 lines.

5 DECOR IDEAS:
1. Specific decor item name — description
2. Specific decor item name — description
3. Specific decor item name — description
4. Specific decor item name — description
5. Specific decor item name — description

SUITABLE PLANTS:
1. Plant name — care tip
2. Plant name — care tip
3. Plant name — care tip

LIGHTING SUGGESTIONS:
1. Lighting item name — description
2. Lighting item name — description
3. Lighting item name — description

MAINTENANCE TASKS:
1. Task name — description
2. Task name — description
3. Task name — description
4. Task name — description

FESTIVAL DECORATIONS:
1. Decoration item name — description
2. Decoration item name — description
3. Decoration item name — description

SHOPPING LIST (under 500 rupees each):
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
      } else if (line.match(/^\d\./) || line.startsWith('- ')) {
        const content = line.replace(/^\d\./, '').replace(/^- /, '').trim();
        const itemName = content.split('—')[0].trim();
        const rest = content.includes('—') ? ' — ' + content.split('—').slice(1).join('—') : '';
        const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(itemName)}`;
        return (
          <p key={i} className="sg-item">
            ✨{' '}
            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="sg-item-link">
              {itemName}
            </a>
            {rest}
          </p>
        );
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
              {/* Images */}
              {images.length > 0 && (
                <div className="sg-images">
                  {images.map((img, i) => (
                    <img key={i} src={img.urls.small} alt={img.alt_description || 'Decor'} className="sg-image" />
                  ))}
                </div>
              )}

              <div className="sg-result-header" style={{ borderLeft: `4px solid ${selectedSeason?.color}` }}>
                <h2>{selectedSeason?.icon} {selectedSeason?.label} Guide</h2>
                <p>{city} • {selectedSeason?.label} Season</p>
              </div>

              <div className="sg-guide-content">
                {formatGuide(guide)}
              </div>

              <button className="sg-retry-btn" onClick={() => { setGuide(null); setCity(''); setSelectedSeason(null); setImages([]); }}>
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