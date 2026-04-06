import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { earnBadge } from '../utils/badgeHelper';
import '../styles/BeforeAfter.css';

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony'];
const STYLES = ['Modern', 'Traditional', 'Minimalist', 'Bohemian', 'Industrial', 'Scandinavian'];

function BeforeAfter() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imageUrl || !roomType || !style) {
      setError('Please upload a photo, select room type and style!');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const prompt = `You are an expert Indian interior designer. A user has uploaded a photo of their ${roomType} and wants to transform it in ${style} style.

Generate a complete transformation plan in this EXACT format:

COLOR SCHEME:
- Primary color and why
- Secondary color and why
- Accent color and why

FURNITURE SUGGESTIONS:
- 3 specific furniture pieces to add or replace with approximate Indian market prices

LIGHTING CHANGES:
- 2-3 lighting suggestions with product names and prices in rupees

DECOR ELEMENTS TO ADD:
- 4 specific decor items with prices in rupees

THINGS TO REMOVE:
- 2-3 items that don't fit the ${style} style

ESTIMATED TOTAL COST:
- Budget option (under ₹50,000)
- Mid range option (₹50,000 to ₹1,50,000)
- Premium option (above ₹1,50,000)

TOP 3 PRODUCT RECOMMENDATIONS:
1. Product name — Store (Amazon/Flipkart/Pepperfry) — Price in rupees
2. Product name — Store — Price in rupees
3. Product name — Store — Price in rupees

TRANSFORMATION SUMMARY:
2-3 lines describing the overall transformation impact.

Keep all suggestions practical for Indian homes and Indian climate.`;

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
      const plan = data.choices[0].message.content;

      // Save to Supabase
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from('before_after').insert([{
          user_id: userData.user.id,
          room_type: roomType,
          style: style,
          image_url: imageUrl.substring(0, 100),
          transformation_plan: plan
        }]);
        await earnBadge('photo_pro', 'Photo Pro', '📸');
      }

      setResult(plan);
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
    setLoading(false);
  };

  const formatPlan = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.match(/^[A-Z\s&]+:$/)) {
        return <h3 key={i} className="plan-section-title">{line}</h3>;
      } else if (line.startsWith('- ') || line.match(/^\d\./)) {
        return <p key={i} className="plan-item">• {line.replace(/^- /, '').replace(/^\d\./, '')}</p>;
      } else if (line.trim()) {
        return <p key={i} className="plan-text">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="ba-container">
      <div className="ba-header">
        <button onClick={() => navigate('/dashboard')} className="ba-back-btn">← Back</button>
        <h1>📸 Before & After Transformation</h1>
        <p>Upload your room photo and see how AI transforms it!</p>
      </div>

      <div className="ba-content">
        {/* Left — Upload & Options */}
        <div className="ba-left">
          <div className="ba-upload-box">
            <h3>📷 Upload Your Room Photo</h3>
            <label className="ba-upload-label">
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              {imagePreview ? (
                <img src={imagePreview} alt="Room" className="ba-preview-img" />
              ) : (
                <div className="ba-upload-placeholder">
                  <span>🖼️</span>
                  <p>Click to upload photo</p>
                  <small>JPG, PNG supported</small>
                </div>
              )}
            </label>
          </div>

          <div className="ba-options">
            <div className="ba-option-group">
              <h3>🏠 Room Type</h3>
              <div className="ba-chips">
                {ROOM_TYPES.map(r => (
                  <button
                    key={r}
                    className={`ba-chip ${roomType === r ? 'active' : ''}`}
                    onClick={() => setRoomType(r)}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div className="ba-option-group">
              <h3>🎨 Transformation Style</h3>
              <div className="ba-chips">
                {STYLES.map(s => (
                  <button
                    key={s}
                    className={`ba-chip ${style === s ? 'active' : ''}`}
                    onClick={() => setStyle(s)}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="ba-error">{error}</p>}

          <button
            className="ba-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '✨ Generating Transformation...' : '✨ Generate Transformation Plan'}
          </button>
        </div>

        {/* Right — Result */}
        <div className="ba-right">
          {loading && (
            <div className="ba-loading">
              <div className="ba-loading-spinner">🏠</div>
              <h3>AI is transforming your room...</h3>
              <p>Analyzing your space and creating a personalized plan!</p>
            </div>
          )}

          {result && !loading && (
            <div className="ba-result">
              <div className="ba-comparison">
                <div className="ba-before">
                  <span className="ba-label">BEFORE</span>
                  {imagePreview && <img src={imagePreview} alt="Before" className="ba-compare-img" />}
                </div>
                <div className="ba-after-placeholder">
                  <span className="ba-label">AFTER (AI Vision)</span>
                  <div className="ba-after-content">
                    <span>✨</span>
                    <p>{style} {roomType}</p>
                    <small>See plan below</small>
                  </div>
                </div>
              </div>

              <div className="ba-plan">
                <h2>🎯 Your Transformation Plan</h2>
                <div className="ba-plan-content">
                  {formatPlan(result)}
                </div>
              </div>

              <button className="ba-retry-btn" onClick={() => { setResult(null); setImagePreview(''); setImageUrl(''); setRoomType(''); setStyle(''); }}>
                🔄 Try Another Room
              </button>
            </div>
          )}

          {!result && !loading && (
            <div className="ba-empty">
              <span>📸</span>
              <h3>Upload a photo to get started!</h3>
              <p>Select your room type and style, then click Generate to see the magic!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BeforeAfter;