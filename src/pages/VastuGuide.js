import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VastuGuide.css';
import jsPDF from 'jspdf';
import { earnBadge } from '../utils/badgeHelper';

function VastuGuide() {
  const navigate = useNavigate();
  const [room, setRoom] = useState('');
  const [facing, setFacing] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Pooja Room', 'Study Room'];
  const facings = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

  const getTips = async () => {
    setLoading(true);
    await earnBadge('vastu_follower', 'Vastu Follower', '🕉️');
    const prompt = `You are a Vastu Shastra expert. Give detailed Vastu tips for:
    Room: ${room}
    House Facing: ${facing}
    Include ideal placement, colors, things to avoid, remedies and specific tips for Indian homes.`;

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
    setTips(data.choices[0].message.content);
    setLoading(false);
  };

  const getImage = async () => {
    setImageLoading(true);
    setShowImage(true);
    try {
      const query = `${room} vastu Indian home`;
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
    doc.text(`Nivaora — Vastu Guide: ${room}`, 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(tips, 170);
    doc.text(lines, 20, 40);
    doc.save('nivaora-vastu-guide.pdf');
  };

  return (
    <div className="vastu-container">
      <div className="vastu-box">
        <h1>Vastu Guide 🕉️</h1>
        <p>Get Vastu Shastra tips for your home!</p>

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
          <h3>House Facing Direction:</h3>
          <div className="options-grid">
            {facings.map((f, i) => (
              <button
                key={i}
                onClick={() => setFacing(f)}
                className={`option-btn ${facing === f ? 'selected' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {room && facing && (
          <button onClick={getTips} className="btn-primary">
            Get Vastu Tips ✨
          </button>
        )}

        {loading && <p className="loading">Getting Vastu tips...</p>}

        {tips && (
          <>
            <div className="tips-content">
              <p>{tips}</p>
            </div>
            <button onClick={getImage} className="btn-image">
              View Room Image 🕉️
            </button>
            {imageLoading && <p className="loading">Loading image...</p>}
            {showImage && image && (
              <div className="image-container">
                <img src={image} alt="Vastu Room" className="home-image" />
              </div>
            )}
            <button onClick={downloadPDF} className="btn-download">
              📥 Download Vastu Guide
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

export default VastuGuide;