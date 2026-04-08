import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { earnBadge } from '../utils/badgeHelper';
import '../styles/GardenPlanner.css';

const GARDEN_SIZES = ['Small (< 100 sq ft)', 'Medium (100-300 sq ft)', 'Large (> 300 sq ft)'];
const SEASONS = ['☀️ Summer', '🌧️ Monsoon', '❄️ Winter', '🌸 Spring'];

function GardenPlanner() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [gardenSize, setGardenSize] = useState('');
  const [season, setSeason] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!city.trim() || !gardenSize || !season) {
      setError('Please fill city, garden size and season!');
      return;
    }
    setError('');
    setLoading(true);
    setPlan(null);

    try {
      const prompt = `You are an expert Indian garden designer. Create a complete garden plan for:
City: ${city}
Garden Size: ${gardenSize}
Season: ${season}

Generate in this EXACT format:

BEST PLANTS FOR THIS SEASON:
1. Plant name — Why suitable — Care level (Easy/Medium/Hard)
2. Plant name — Why suitable — Care level
3. Plant name — Why suitable — Care level
4. Plant name — Why suitable — Care level
5. Plant name — Why suitable — Care level
6. Plant name — Why suitable — Care level

FLOWER SUGGESTIONS:
1. Flower name — Color — Care level — Blooming season
2. Flower name — Color — Care level — Blooming season
3. Flower name — Color — Care level — Blooming season
4. Flower name — Color — Care level — Blooming season

GARDEN LAYOUT:
Describe the ideal layout for this size garden in 3-4 lines.

PATHWAY SUGGESTIONS:
2 specific pathway ideas with materials and approximate cost in rupees.

WATER FEATURE IDEAS:
1-2 water feature ideas suitable for this garden size and budget.

SEASONAL MAINTENANCE TIPS:
5 specific maintenance tasks for ${season} season in ${city}.

PLANTS TO AVOID THIS SEASON:
3 plants to avoid and why.

ESTIMATED BUDGET:
- Basic setup cost in rupees
- Mid range cost in rupees
- Premium cost in rupees

Keep all suggestions specific to ${city} climate and Indian gardening conditions.`;

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
      const gardenPlan = data.choices[0].message.content;

      // Save to Supabase
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from('garden_plans').insert([{
          user_id: userData.user.id,
          city: city,
          garden_size: gardenSize,
          season: season,
          plan: gardenPlan
        }]);
        await earnBadge('home_planner', 'Home Planner', '🏗️');
      }

      setPlan(gardenPlan);
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  const formatPlan = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.match(/^[A-Z\s&]+:$/) || line.match(/^[A-Z][A-Z\s&]+:$/)) {
        return <h3 key={i} className="gp-section-title">{line}</h3>;
      } else if (line.match(/^\d\./)) {
        return <p key={i} className="gp-item">🌿 {line.replace(/^\d\./, '').trim()}</p>;
      } else if (line.startsWith('- ')) {
        return <p key={i} className="gp-item">• {line.replace(/^- /, '')}</p>;
      } else if (line.trim()) {
        return <p key={i} className="gp-text">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="gp-container">
      <div className="gp-header">
        <button onClick={() => navigate('/dashboard')} className="gp-back-btn">← Back</button>
        <h1>🌿 Garden & Outdoor Planner</h1>
        <p>Get a complete garden plan based on your city and season!</p>
      </div>

      <div className="gp-content">
        {/* Left — Inputs */}
        <div className="gp-left">
          <div className="gp-card">
            <h3>🏙️ Your City</h3>
            <input
              type="text"
              placeholder="Enter your city (e.g. Hyderabad)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="gp-input"
            />
          </div>

          <div className="gp-card">
            <h3>📐 Garden Size</h3>
            <div className="gp-chips">
              {GARDEN_SIZES.map((s, i) => (
                <button
                  key={i}
                  className={`gp-chip ${gardenSize === s ? 'active' : ''}`}
                  onClick={() => setGardenSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="gp-card">
            <h3>🌤️ Current Season</h3>
            <div className="gp-chips">
              {SEASONS.map((s, i) => (
                <button
                  key={i}
                  className={`gp-chip ${season === s ? 'active' : ''}`}
                  onClick={() => setSeason(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          {error && <p className="gp-error">{error}</p>}

          <button
            className="gp-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '🌱 Generating Garden Plan...' : '🌱 Generate My Garden Plan'}
          </button>
        </div>

        {/* Right — Result */}
        <div className="gp-right">
          {loading && (
            <div className="gp-loading">
              <div className="gp-loading-icon">🌿</div>
              <h3>Creating your garden plan...</h3>
              <p>AI is analyzing {city} climate and {season} season!</p>
            </div>
          )}

          {plan && !loading && (
            <div className="gp-result">
              <div className="gp-result-header">
                <h2>🌳 Your Garden Plan</h2>
                <p>{city} • {gardenSize} • {season}</p>
              </div>
              <div className="gp-plan-content">
                {formatPlan(plan)}
              </div>
              <button className="gp-retry-btn" onClick={() => { setPlan(null); setCity(''); setGardenSize(''); setSeason(''); }}>
                🔄 Plan Another Garden
              </button>
            </div>
          )}

          {!plan && !loading && (
            <div className="gp-empty">
              <span>🌿</span>
              <h3>Your garden plan will appear here!</h3>
              <p>Enter your city, garden size and season to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GardenPlanner;