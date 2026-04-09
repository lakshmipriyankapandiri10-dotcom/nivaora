import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CarbonScore.css';

const QUESTIONS = [
  {
    id: 'materials',
    question: '🏗️ What building materials did you use?',
    options: [
      { label: 'Fly ash bricks + recycled materials', score: 20 },
      { label: 'Normal bricks + some recycled', score: 14 },
      { label: 'Cement blocks + standard materials', score: 8 },
      { label: 'All new standard materials', score: 4 },
    ]
  },
  {
    id: 'energy',
    question: '⚡ What is your energy source?',
    options: [
      { label: 'Solar panels — fully solar', score: 20 },
      { label: 'Solar + grid electricity mix', score: 14 },
      { label: 'Grid electricity only', score: 6 },
      { label: 'Generator + grid', score: 2 },
    ]
  },
  {
    id: 'water',
    question: '💧 How do you manage water?',
    options: [
      { label: 'Rainwater harvesting + recycling', score: 20 },
      { label: 'Borewell + some conservation', score: 13 },
      { label: 'Municipal water only', score: 7 },
      { label: 'No water management', score: 3 },
    ]
  },
  {
    id: 'waste',
    question: '♻️ How do you handle waste?',
    options: [
      { label: 'Composting + full segregation', score: 20 },
      { label: 'Segregation only', score: 13 },
      { label: 'Minimal segregation', score: 7 },
      { label: 'No waste management', score: 3 },
    ]
  },
  {
    id: 'transport',
    question: '🚗 How accessible is your location?',
    options: [
      { label: 'Walking distance to everything', score: 20 },
      { label: 'Public transport nearby', score: 14 },
      { label: 'Need vehicle for most things', score: 7 },
      { label: 'Very remote, car essential', score: 3 },
    ]
  },
];

function CarbonScore() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSelect = (questionId, score, label) => {
    setAnswers(prev => ({ ...prev, [questionId]: { score, label } }));
  };

  const handleCalculate = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      setError('Please answer all 5 questions!');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);

    try {
      const answerSummary = QUESTIONS.map(q => `${q.question}: ${answers[q.id]?.label}`).join('\n');

      const prompt = `You are an eco-home expert. A user answered these questions about their home:

${answerSummary}

Total Score: ${totalScore}/100

Provide analysis in this EXACT format:

OVERALL GRADE:
Give a grade A, B, C, D, or E based on the score. A=80+, B=60-79, C=40-59, D=20-39, E=below 20

WHAT YOU ARE DOING WELL:
1. Strength point with explanation
2. Strength point with explanation

3 IMPROVEMENTS TO INCREASE SCORE:
1. Specific improvement with expected score increase
2. Specific improvement with expected score increase
3. Specific improvement with expected score increase

ENVIRONMENTAL IMPACT:
2 lines about the environmental impact of their current home setup.

Keep suggestions practical for Indian homes.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800
        })
      });

      const data = await response.json();
      setResult({ score: totalScore, analysis: data.choices[0].message.content });
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#2e7d32';
    if (score >= 60) return '#4caf50';
    if (score >= 40) return '#ff9800';
    return '#c2714f';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent 🌟';
    if (score >= 60) return 'Good 👍';
    if (score >= 40) return 'Average 😐';
    return 'Needs Improvement 💪';
  };

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.match(/^[A-Z0-9\s&():]+:$/) || line.match(/^[A-Z][A-Z0-9\s&():]+:$/)) {
        return <h3 key={i} className="cs-section-title">{line}</h3>;
      } else if (line.match(/^\d\./) || line.startsWith('- ')) {
        return <p key={i} className="cs-item">• {line.replace(/^\d\./, '').replace(/^- /, '').trim()}</p>;
      } else if (line.trim()) {
        return <p key={i} className="cs-text">{line}</p>;
      }
      return null;
    });
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="cs-container">
      <div className="cs-header">
        <button onClick={() => navigate('/dashboard')} className="cs-back-btn">← Back</button>
        <h1>🌱 Carbon Footprint Score</h1>
        <p>Find out how eco-friendly your home is!</p>
      </div>

      <div className="cs-content">
        {/* Left — Questions */}
        <div className="cs-left">
          <div className="cs-progress-bar-wrap">
            <div className="cs-progress-info">
              <span>Questions answered</span>
              <span>{answeredCount}/{QUESTIONS.length}</span>
            </div>
            <div className="cs-progress-track">
              <div className="cs-progress-fill" style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }} />
            </div>
          </div>

          {QUESTIONS.map((q) => (
            <div key={q.id} className="cs-question-card">
              <h3>{q.question}</h3>
              <div className="cs-options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`cs-option ${answers[q.id]?.label === opt.label ? 'active' : ''}`}
                    onClick={() => handleSelect(q.id, opt.score, opt.label)}
                  >
                    <span>{opt.label}</span>
                    <span className="cs-option-score">+{opt.score}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {error && <p className="cs-error">{error}</p>}

          <button className="cs-calculate-btn" onClick={handleCalculate} disabled={loading}>
            {loading ? '🌱 Calculating...' : '🌱 Calculate My Score'}
          </button>
        </div>

        {/* Right — Result */}
        <div className="cs-right">
          {loading && (
            <div className="cs-loading">
              <div className="cs-loading-icon">🌱</div>
              <h3>Calculating your eco score...</h3>
              <p>Analyzing your home's environmental impact!</p>
            </div>
          )}

          {result && !loading && (
            <div className="cs-result">
              {/* Score Circle */}
              <div className="cs-score-circle-wrap">
                <div className="cs-score-circle" style={{ borderColor: getScoreColor(result.score) }}>
                  <span className="cs-score-num" style={{ color: getScoreColor(result.score) }}>
                    {result.score}
                  </span>
                  <span className="cs-score-total">/100</span>
                </div>
                <h2 style={{ color: getScoreColor(result.score) }}>{getScoreLabel(result.score)}</h2>
              </div>

              {/* Category Bars */}
              <div className="cs-bars">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="cs-bar-item">
                    <div className="cs-bar-info">
                      <span className="cs-bar-label">{q.question.split(' ').slice(1, 3).join(' ')}</span>
                      <span className="cs-bar-score">{answers[q.id]?.score}/20</span>
                    </div>
                    <div className="cs-bar-track">
                      <div
                        className="cs-bar-fill"
                        style={{
                          width: `${(answers[q.id]?.score / 20) * 100}%`,
                          background: getScoreColor(answers[q.id]?.score * 5)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis */}
              <div className="cs-analysis">
                {formatAnalysis(result.analysis)}
              </div>

              <button className="cs-retry-btn" onClick={() => { setResult(null); setAnswers({}); }}>
                🔄 Recalculate
              </button>
            </div>
          )}

          {!result && !loading && (
            <div className="cs-empty">
              <span>🌍</span>
              <h3>Your eco score will appear here!</h3>
              <p>Answer all 5 questions and click Calculate to see your score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarbonScore;