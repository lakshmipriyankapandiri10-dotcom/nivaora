import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/Suggestions.css';
import jsPDF from 'jspdf';

function Suggestions() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [prefs, setPrefs] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const { data: prefsData } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (prefsData && prefsData.length > 0) {
          const p = prefsData[0];
          setPrefs(p);
          const prompt = `You are a home design expert. Based on these preferences:
          Plot Size: ${p.plot_size}
          City: ${p.city}
          House Type: ${p.house_type}
          Floors: ${p.floors}
          Bedrooms: ${p.bedrooms}
          Style: ${p.style}
          Colors: ${p.colors}
          Budget: ${p.budget}
          Give detailed home design suggestions.`;

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
        } else {
          setError('No preferences found. Please fill Plan My Home first.');
        }
      } catch (err) {
        setError('Something went wrong: ' + err.message);
      }
      setLoading(false);
    };
    getSuggestions();
  }, []);

  const getImage = async () => {
    setImageLoading(true);
    setShowImage(true);
    try {
      const query = prefs ? `${prefs.style} ${prefs.house_type} home interior India` : 'beautiful home interior India';
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
    doc.text('Nivaora — Home Design Suggestions', 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(suggestions, 170);
    doc.text(lines, 20, 40);
    doc.save('nivaora-suggestions.pdf');
  };

  const shareOnWhatsApp = () => {
    const text = `🏡 My Nivaora Home Design Plan!\n\n${suggestions.substring(0, 300)}...\n\nCheck out Nivaora: https://nivaora.vercel.app`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyLink = () => {
    const text = `🏡 My Nivaora Home Design Plan!\n\n${suggestions.substring(0, 500)}...\n\nCheck out Nivaora: https://nivaora.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-box">
        <h1>Your Home Design Suggestions 🏡</h1>
        {loading ? (
          <div className="loading">
            <p>AI is generating your personalized suggestions...</p>
          </div>
        ) : error ? (
          <div className="loading">
            <p style={{color: 'red'}}>{error}</p>
          </div>
        ) : (
          <>
            <div className="suggestions-content">
              <p>{suggestions}</p>
            </div>

            <button onClick={getImage} className="btn-image">
              View Home Image 🏠
            </button>
            {imageLoading && <p className="loading">Loading image...</p>}
            {showImage && image && (
              <div className="image-container">
                <img src={image} alt="Home Design" className="home-image" />
              </div>
            )}

            <button onClick={downloadPDF} className="btn-download">
              📥 Download as PDF
            </button>

            {/* Share Buttons */}
            <div className="share-btns">
              <button onClick={shareOnWhatsApp} className="btn-whatsapp">
                📲 Share on WhatsApp
              </button>
              <button onClick={copyLink} className="btn-copy">
                {copied ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </>
        )}
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Suggestions;