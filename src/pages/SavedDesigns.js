import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/SavedDesigns.css';

function SavedDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getDesigns = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const { data } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
      setDesigns(data || []);
      setLoading(false);
    };
    getDesigns();
  }, []);

  const deleteDesign = async (id) => {
    await supabase.from('saved_designs').delete().eq('id', id);
    setDesigns(designs.filter(d => d.id !== id));
  };

  const filteredDesigns = designs.filter(d =>
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="saved-container">
      <div className="saved-box">
        <h1>Saved Designs ❤️</h1>
        <p>Your saved home design ideas!</p>

        {/* Search Bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search your designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {loading && <p className="loading">Loading your designs...</p>}

        {!loading && designs.length === 0 && (
          <div className="empty-state">
            <p>No saved designs yet!</p>
            <p>Start exploring and save your favorite ideas.</p>
            <button onClick={() => navigate('/decor')} className="btn-primary">
              Explore Decor Ideas
            </button>
          </div>
        )}

        {!loading && designs.length > 0 && filteredDesigns.length === 0 && (
          <div className="empty-state">
            <p>No designs found for "{searchQuery}"</p>
            <button className="btn-primary" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          </div>
        )}

        <div className="designs-grid">
          {filteredDesigns.map((d, i) => (
            <div key={i} className="design-card">
              {d.image_url && <img src={d.image_url} alt={d.title} />}
              <h3>{d.title}</h3>
              <p>{d.description}</p>
              <button onClick={() => deleteDesign(d.id)} className="btn-delete">
                Delete
              </button>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SavedDesigns;