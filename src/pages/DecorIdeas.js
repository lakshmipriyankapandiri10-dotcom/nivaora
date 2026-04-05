import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DecorIdeas.css';
import jsPDF from 'jspdf';
import { supabase } from '../utils/supabase';

function DecorIdeas() {
  const navigate = useNavigate();
  const [room, setRoom] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('#f5a623');
  const [ideas, setIdeas] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Pooja Room'];
  const styles = ['Modern', 'Traditional', 'Minimalist', 'Bohemian', 'Royal'];

 const presetColors = [
  '#f5a623', '#e53935', '#8bc34a', '#2196f3',
  '#9c27b0', '#ffffff', '#795548', '#607d8b',
  '#ffccbc', '#f8bbd0', '#e1bee7', '#bbdefb',
  '#c8e6c9', '#fff9c4', '#ffe0b2', '#f0f4c3'
];

  const getIdeas = async () => {
    setLoading(true);
    setSaved(false);
    const prompt = `You are an interior design expert. Give detailed decoration ideas for:
    Room: ${room}
    Style: ${style}
    Primary Wall Color: ${color}
    Include furniture suggestions, color schemes that match ${color}, lighting ideas, and decor tips specific to Indian homes.`;

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
    setIdeas(data.choices[0].message.content);
    setLoading(false);
  };

  const getImage = async () => {
    setImageLoading(true);
    setShowImage(true);
    try {
      const query = `${style} ${room} interior India`;
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setImage(data.results[0].urls.regular);
      }
    } catch (err) {
      console.log('Image error:', err);
    }
    setImageLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Nivaora — ${room} Decor Ideas`, 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(ideas, 170);
    doc.text(lines, 20, 40);
    doc.save('nivaora-decor-ideas.pdf');
  };

  const saveToFavorites = async () => {
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from('saved_designs').insert([{
      user_id: userData.user.id,
      title: `${style} ${room}`,
      description: ideas.substring(0, 200) + '...',
      image_url: image || '',
      design_type: 'decor'
    }]);
    setSaved(true);
  };

  return (
    <div className="decor-container">
      <div className="decor-box">
        <h1>Decor Ideas 🏠</h1>
        <p>Get AI powered decoration ideas for any room!</p>

        <div className="select-group">
          <h3>Select Room:</h3>
          <div className="options-grid">
            {rooms.map((r, i) => (
              <button
                key={i}
                onClick={() => setRoom(r)}
                className={`option-btn ${room === r ? 'selected' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="select-group">
          <h3>Select Style:</h3>
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

        {/* 🎨 Color Picker */}
        <div className="select-group">
          <h3>Pick Wall Color: 🎨</h3>
          <div className="color-picker-row">
            <div className="preset-colors">
              {presetColors.map((c, i) => (
                <button
                  key={i}
                  className={`color-swatch ${color === c ? 'selected-swatch' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <div className="custom-color">
              <label>Custom:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-input"
              />
            </div>
          </div>
          <div className="color-preview" style={{ background: color }}>
            <span style={{ color: color === '#ffffff' ? '#333' : 'white' }}>
              Wall Preview — {color}
            </span>
          </div>
        </div>

        {room && style && (
          <button onClick={getIdeas} className="btn-primary">
            Get Decor Ideas ✨
          </button>
        )}

        {loading && <p className="loading">AI is generating ideas...</p>}

        {ideas && (
          <>
            <div className="ideas-content">
              <p>{ideas}</p>
            </div>
            <button onClick={getImage} className="btn-image">
              View Room Image 🏠
            </button>
            {imageLoading && <p className="loading">Loading image...</p>}
            {showImage && image && (
              <div className="image-container">
                <img src={image} alt="Room Design" className="home-image" />
              </div>
            )}
            <button onClick={saveToFavorites} className="btn-favorite" disabled={saved}>
              {saved ? '✅ Saved to Favorites!' : '⭐ Save to Favorites'}
            </button>
            <button onClick={downloadPDF} className="btn-download">
              📥 Download Decor Ideas
            </button>
          </>
        )}

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default DecorIdeas;