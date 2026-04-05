import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/CommunityFeed.css';
import { earnBadge } from '../utils/badgeHelper';

function CommunityFeed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState('Living Room');
  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const [imageUrl, setImageUrl] = useState('');
  const [sharing, setSharing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeComment, setActiveComment] = useState(null);
  const [comments, setComments] = useState({});
  const [userLikes, setUserLikes] = useState([]);

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Balcony', 'Pooja Room'];
  const styleOptions = ['Modern', 'Traditional', 'Minimalist', 'Bohemian', 'Royal'];

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      setCurrentUser(data.user);
      await fetchPosts();
      await fetchUserLikes(data.user.id);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const fetchUserLikes = async (userId) => {
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);
    setUserLikes((data || []).map(l => l.post_id));
  };

  const fetchComments = async (postId) => {
    const { data } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(prev => ({ ...prev, [postId]: data || [] }));
  };

  const sharePost = async () => {
    if (!title || !description) return;
    setSharing(true);
    await supabase.from('community_posts').insert([{
      user_id: currentUser.id,
      user_name: currentUser.user_metadata.name || 'User',
      title,
      description,
      image_url: imageUrl,
      room_type: roomType,
      style: selectedStyle,
    }]);
    await earnBadge('community_star', 'Community Star', '🌐');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setShowShare(false);
    setSharing(false);
    await fetchPosts();
  };

  const toggleLike = async (post) => {
    const alreadyLiked = userLikes.includes(post.id);
    if (alreadyLiked) {
      await supabase.from('post_likes').delete()
        .eq('post_id', post.id).eq('user_id', currentUser.id);
      await supabase.from('community_posts').update({ likes: post.likes - 1 }).eq('id', post.id);
      setUserLikes(userLikes.filter(id => id !== post.id));
    } else {
      await supabase.from('post_likes').insert([{ post_id: post.id, user_id: currentUser.id }]);
      await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', post.id);
      setUserLikes([...userLikes, post.id]);
    }
    await fetchPosts();
  };

  const addComment = async (postId) => {
    if (!commentText.trim()) return;
    await supabase.from('post_comments').insert([{
      post_id: postId,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata.name || 'User',
      comment: commentText,
    }]);
    setCommentText('');
    await fetchComments(postId);
  };

  const toggleComments = async (postId) => {
    if (activeComment === postId) {
      setActiveComment(null);
    } else {
      setActiveComment(postId);
      await fetchComments(postId);
    }
  };

  return (
    <div className="community-container">
      <div className="community-box">
        <div className="community-header">
          <div>
            <h1>Community Feed 🌐</h1>
            <p>Share and explore home design ideas!</p>
          </div>
          <button className="btn-share-toggle" onClick={() => setShowShare(!showShare)}>
            {showShare ? '✕ Close' : '+ Share Design'}
          </button>
        </div>

        {showShare && (
          <div className="share-form">
            <h3>Share Your Design 🏠</h3>
            <input type="text" placeholder="Title (e.g. My Modern Living Room)" value={title} onChange={e => setTitle(e.target.value)} className="share-input" />
            <textarea placeholder="Describe your design..." value={description} onChange={e => setDescription(e.target.value)} className="share-textarea" />
            <input type="text" placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="share-input" />
            <div className="share-selects">
              <select value={roomType} onChange={e => setRoomType(e.target.value)} className="share-select">
                {rooms.map((r, i) => <option key={i} value={r}>{r}</option>)}
              </select>
              <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} className="share-select">
                {styleOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={sharePost} className="btn-primary" disabled={sharing}>
              {sharing ? 'Sharing...' : '🚀 Share to Community'}
            </button>
          </div>
        )}

        {loading && <p className="loading">Loading community posts...</p>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <p>No posts yet! Be the first to share! 🎉</p>
          </div>
        )}

        <div className="posts-list">
          {posts.map((post, i) => (
            <div key={i} className="post-card">
              <div className="post-header">
                <div className="post-avatar">{post.user_name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <strong>{post.user_name}</strong>
                  <p className="post-meta">{post.room_type} • {post.style}</p>
                </div>
                <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              {post.image_url && <img src={post.image_url} alt={post.title} className="post-image" />}
              <h3 className="post-title">{post.title}</h3>
              <p className="post-desc">{post.description}</p>
              <div className="post-actions">
                <button
                  className={`btn-like ${userLikes.includes(post.id) ? 'liked' : ''}`}
                  onClick={() => toggleLike(post)}
                >
                  {userLikes.includes(post.id) ? '❤️' : '🤍'} {post.likes}
                </button>
                <button className="btn-comment" onClick={() => toggleComments(post.id)}>
                  💬 Comments
                </button>
              </div>

              {activeComment === post.id && (
                <div className="comments-section">
                  {(comments[post.id] || []).map((c, j) => (
                    <div key={j} className="comment-item">
                      <strong>{c.user_name}:</strong> {c.comment}
                    </div>
                  ))}
                  <div className="comment-input-row">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="comment-input"
                      onKeyPress={e => e.key === 'Enter' && addComment(post.id)}
                    />
                    <button onClick={() => addComment(post.id)} className="btn-send">➤</button>
                  </div>
                </div>
              )}
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

export default CommunityFeed;