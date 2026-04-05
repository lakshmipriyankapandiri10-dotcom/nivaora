import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WasteToDecor.css';

function WasteToDecor() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState('');
  const [room, setRoom] = useState('');
  const [ideas, setIdeas] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Garden'];

  const getIdeas = async () => {
    setLoading(true);
    const prompt = `You are a creative upcycling expert. Give 5 creative decoration ideas using:
    Materials: ${materials}
    Room: ${room}
    Make it practical for Indian households.`;

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
      const query = `upcycled ${room} decor creative`;
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

  return (
    <div className="waste-container">
      <div className="waste-box">
        <h1>Waste to Decor ♻️</h1>
        <p>Turn your waste materials into beautiful home decor!</p>

        <div className="input-group">
          <h3>What waste materials do you have?</h3>
          <input
            type="text"
            placeholder="e.g. old bottles, cardboard, fabric scraps..."
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
          />
        </div>

        <div className="select-group">
          <h3>Which room is it for?</h3>
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

        {materials && room && (
          <button onClick={getIdeas} className="btn-primary">
            Get Creative Ideas ✨
          </button>
        )}

        {loading && <p className="loading">AI is generating creative ideas...</p>}

        {ideas && (
          <>
            <div className="ideas-content">
              <p>{ideas}</p>
            </div>
            <button onClick={getImage} className="btn-image">
              View Decor Image ♻️
            </button>
            {imageLoading && <p className="loading">Loading image...</p>}
            {showImage && image && (
              <div className="image-container">
                <img src={image} alt="Decor Idea" className="home-image" />
              </div>
            )}
          </>
        )}

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default WasteToDecor;