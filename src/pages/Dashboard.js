import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Notifications from './Notifications';
import '../styles/Dashboard.css';
import { earnBadge } from '../utils/badgeHelper';

const DAILY_TIPS = [
  "🌿 Add indoor plants like Money Plant or Peace Lily to improve air quality in your home!",
  "💡 Use warm LED bulbs (2700K-3000K) in living rooms for a cozy feel.",
  "🎨 Paint your north-facing rooms in warm colors to compensate for less sunlight.",
  "🪟 Keep windows clean — natural light makes rooms look bigger and brighter!",
  "♻️ Old sarees and dupattas can be repurposed as beautiful curtains or wall hangings.",
  "🌬️ Cross ventilation — open windows on opposite walls to naturally cool your home.",
  "🏠 Declutter one room per week — a clean home feels bigger and more peaceful.",
  "💧 Fix dripping taps immediately — a small drip wastes 20 liters of water per day!",
  "🌺 Marigold plants near entrance keep mosquitoes away naturally.",
  "🛋️ Use mirrors strategically to make small rooms appear larger.",
  "🎍 Bamboo plants are lucky according to Vastu and grow easily indoors.",
  "🔧 Check water pipes every monsoon before the rains start.",
  "🌙 Use blackout curtains in bedrooms for better sleep quality.",
  "🏡 Paint your main door a bold color — it creates a great first impression!",
  "🌱 Compost your kitchen waste — it makes excellent fertilizer for your garden.",
  "💰 Buy furniture during festival sales — Diwali and Onam have the best discounts!",
  "🪴 Terracotta pots are better than plastic — they allow soil to breathe.",
  "🧹 Clean ceiling fans monthly — dust on blades reduces efficiency by 25%.",
  "🌞 South-facing homes get the most sunlight — great for solar panels!",
  "🎯 Use vertical space — tall shelves save floor space in small homes.",
];

const translations = {
  en: {
    welcome: 'Welcome back',
    subtitle: 'What would you like to do today?',
    dark: '🌙 Dark',
    light: '☀️ Light',
    profile: '👤 Profile',
    logout: 'Logout',
    tipTitle: '💡 Tip of the Day',
    streakLabel: 'Day Streak',
    longestLabel: 'Best',
    searchPlaceholder: 'Search features...',
    noResults: 'No results found',
    features: [
      { icon: '🏗️', title: 'Plan My Home', desc: 'Design your dream home from your plot' },
      { icon: '🏠', title: 'Decor Ideas', desc: 'Room by room decoration suggestions' },
      { icon: '♻️', title: 'Waste to Decor', desc: 'Turn waste into beautiful decor' },
      { icon: '💰', title: 'Budget Planner', desc: 'Plan and track your home budget' },
      { icon: '🕉️', title: 'Vastu Guide', desc: 'Vastu compliant home planning' },
      { icon: '❤️', title: 'Saved Designs', desc: 'Your saved ideas and designs' },
      { icon: '📸', title: 'Photo Analyze', desc: 'Upload room photo for AI suggestions' },
      { icon: '📊', title: 'Progress Tracker', desc: 'Track your home building journey' },
      { icon: '🎨', title: 'Wall Color', desc: 'Visualize wall colors before painting' },
      { icon: '🗺️', title: 'Floor Plan', desc: 'Draw your home layout' },
      { icon: '🌐', title: 'Community Feed', desc: 'Share and explore design ideas' },
      { icon: '🏆', title: 'Achievements', desc: 'View your earned badges' },
      { icon: '✨', title: 'Before & After', desc: 'Transform your room with AI' },
      { icon: '🌿', title: 'Garden Planner', desc: 'Plan your garden by season and city' },
      { icon: '🗓️', title: 'Seasonal Guide', desc: 'Festival and season home tips' },
      { icon: '🔔', title: 'Maintenance', desc: 'Home maintenance reminders' },
      { icon: '🌱', title: 'Carbon Score', desc: 'Check your home eco score' },
    ]
  },
  te: {
    welcome: 'తిరిగి స్వాగతం',
    subtitle: 'ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?',
    dark: '🌙 డార్క్',
    light: '☀️ లైట్',
    profile: '👤 ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    tipTitle: '💡 నేటి టిప్',
    streakLabel: 'రోజుల స్ట్రీక్',
    longestLabel: 'బెస్ట్',
    searchPlaceholder: 'ఫీచర్లు వెతకండి...',
    noResults: 'ఫలితాలు లేవు',
    features: [
      { icon: '🏗️', title: 'నా ఇల్లు ప్లాన్ చేయి', desc: 'మీ స్థలం నుండి కల ఇంటిని డిజైన్ చేయండి' },
      { icon: '🏠', title: 'డెకోర్ ఆలోచనలు', desc: 'గది వారీగా అలంకరణ సూచనలు' },
      { icon: '♻️', title: 'వ్యర్థం నుండి అలంకారం', desc: 'వ్యర్థ వస్తువులను అందమైన డెకోర్‌గా మార్చండి' },
      { icon: '💰', title: 'బడ్జెట్ ప్లానర్', desc: 'మీ ఇంటి బడ్జెట్‌ను ప్లాన్ చేయండి' },
      { icon: '🕉️', title: 'వాస్తు గైడ్', desc: 'వాస్తు అనుకూల ఇల్లు ప్లానింగ్' },
      { icon: '❤️', title: 'సేవ్ చేసిన డిజైన్లు', desc: 'మీ సేవ్ చేసిన ఆలోచనలు మరియు డిజైన్లు' },
      { icon: '📸', title: 'ఫోటో విశ్లేషణ', desc: 'AI సూచనల కోసం గది ఫోటో అప్‌లోడ్ చేయండి' },
      { icon: '📊', title: 'ప్రోగ్రెస్ ట్రాకర్', desc: 'మీ ఇల్లు నిర్మాణ ప్రయాణాన్ని ట్రాక్ చేయండి' },
      { icon: '🎨', title: 'వాల్ కలర్', desc: 'పెయింట్ చేయడానికి ముందు రంగు చూడండి' },
      { icon: '🗺️', title: 'ఫ్లోర్ ప్లాన్', desc: 'మీ ఇంటి లేఅవుట్ గీయండి' },
      { icon: '🌐', title: 'కమ్యూనిటీ ఫీడ్', desc: 'డిజైన్ ఆలోచనలు షేర్ చేయండి' },
      { icon: '🏆', title: 'అచీవ్‌మెంట్స్', desc: 'మీ బ్యాడ్జెస్ చూడండి' },
      { icon: '✨', title: 'బిఫోర్ & ఆఫ్టర్', desc: 'AI తో మీ గదిని మార్చండి' },
      { icon: '🌿', title: 'గార్డెన్ ప్లానర్', desc: 'సీజన్ మరియు నగరం ప్రకారం గార్డెన్ ప్లాన్ చేయండి' },
      { icon: '🗓️', title: 'సీజనల్ గైడ్', desc: 'పండుగలు మరియు సీజన్ హోమ్ టిప్స్' },
      { icon: '🔔', title: 'మెయింటెనెన్స్', desc: 'ఇల్లు నిర్వహణ రిమైండర్లు' },
      { icon: '🌱', title: 'కార్బన్ స్కోర్', desc: 'మీ ఇంటి ఎకో స్కోర్ చెక్ చేయండి' },
    ]
  },
  hi: {
    welcome: 'वापस स्वागत है',
    subtitle: 'आज आप क्या करना चाहेंगे?',
    dark: '🌙 डार्क',
    light: '☀️ लाइट',
    profile: '👤 प्रोफाइल',
    logout: 'लॉगआउट',
    tipTitle: '💡 आज की टिप',
    streakLabel: 'दिन स्ट्रीक',
    longestLabel: 'बेस्ट',
    searchPlaceholder: 'फीचर्स खोजें...',
    noResults: 'कोई परिणाम नहीं',
    features: [
      { icon: '🏗️', title: 'घर की योजना बनाएं', desc: 'अपने प्लॉट से सपनों का घर डिज़ाइन करें' },
      { icon: '🏠', title: 'डेकोर आइडियाज़', desc: 'कमरे के अनुसार सजावट के सुझाव' },
      { icon: '♻️', title: 'कचरे से सजावट', desc: 'कचरे को सुंदर सजावट में बदलें' },
      { icon: '💰', title: 'बजट प्लानर', desc: 'अपने घर का बजट प्लान करें' },
      { icon: '🕉️', title: 'वास्तु गाइड', desc: 'वास्तु के अनुकूल घर की योजना' },
      { icon: '❤️', title: 'सेव्ड डिज़ाइन्स', desc: 'आपके सेव किए गए आइडियाज़ और डिज़ाइन्स' },
      { icon: '📸', title: 'फोटो विश्लेषण', desc: 'AI सुझावों के लिए कमरे की फोटो अपलोड करें' },
      { icon: '📊', title: 'प्रगति ट्रैकर', desc: 'अपनी घर निर्माण यात्रा को ट्रैक करें' },
      { icon: '🎨', title: 'वॉल कलर', desc: 'पेंट करने से पहले रंग देखें' },
      { icon: '🗺️', title: 'फ्लोर प्लान', desc: 'अपने घर का लेआउट बनाएं' },
      { icon: '🌐', title: 'कम्युनिटी फीड', desc: 'डिज़ाइन आइडियाज़ शेयर करें' },
      { icon: '🏆', title: 'अचीवमेंट्स', desc: 'अपने बैज देखें' },
      { icon: '✨', title: 'बिफोर & आफ्टर', desc: 'AI से अपना कमरा बदलें' },
      { icon: '🌿', title: 'गार्डन प्लानर', desc: 'मौसम और शहर के अनुसार गार्डन प्लान करें' },
      { icon: '🗓️', title: 'सीजनल गाइड', desc: 'त्योहार और मौसम होम टिप्स' },
      { icon: '🔔', title: 'मेंटेनेंस', desc: 'घर रखरखाव रिमाइंडर' },
      { icon: '🌱', title: 'कार्बन स्कोर', desc: 'अपने घर का इको स्कोर चेक करें' },
    ]
  }
};

const paths = [
  '/plan', '/decor', '/waste', '/budget', '/vastu', '/saved',
  '/photo', '/progress', '/wallcolor', '/floorplan', '/community',
  '/badges', '/beforeafter', '/garden', '/seasonal', '/maintenance', '/carbon'
];

function Dashboard() {
  const navigate   = useNavigate();
  const searchRef  = useRef(null);

  const [userName,       setUserName]       = useState('');
  const [chatOpen,       setChatOpen]       = useState(false);
  const [darkMode,       setDarkMode]       = useState(false);
  const [lang,           setLang]           = useState('en');
  const [messages,       setMessages]       = useState([
    { role: 'assistant', content: 'Hi! 👋 I am Nivaora Assistant. Ask me anything about home design or this app!' }
  ]);
  const [input,          setInput]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [dailyTip,       setDailyTip]       = useState('');
  const [streak,         setStreak]         = useState(0);
  const [longestStreak,  setLongestStreak]  = useState(0);

  // ── Search State ────────────────────────────────────────────
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [activeIdx,     setActiveIdx]     = useState(-1);

  const t = translations[lang];

  // ── Search Logic ────────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setShowDropdown(false);
      setActiveIdx(-1);
      return;
    }
    const matched = t.features
      .map((f, i) => ({ ...f, path: paths[i] }))
      .filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q)
      );
    setSearchResults(matched);
    setShowDropdown(true);
    setActiveIdx(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, lang]);

  const handleSearchKey = (e) => {
    if (!showDropdown || !searchResults.length) return;
    if      (e.key === 'ArrowDown')              setActiveIdx(p => (p + 1) % searchResults.length);
    else if (e.key === 'ArrowUp')                setActiveIdx(p => (p - 1 + searchResults.length) % searchResults.length);
    else if (e.key === 'Enter' && activeIdx >= 0) goToFeature(searchResults[activeIdx].path);
    else if (e.key === 'Escape')                 clearSearch();
  };

  const goToFeature = (path) => { navigate(path); clearSearch(); };
  const clearSearch = ()      => { setSearchQuery(''); setShowDropdown(false); setActiveIdx(-1); };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Streak Logic ────────────────────────────────────────────
  const updateStreak = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existing) {
        await supabase.from('user_streaks').insert([{
          user_id: userId, current_streak: 1, last_login: today, longest_streak: 1,
        }]);
        setStreak(1); setLongestStreak(1);
      } else {
        const lastLogin   = existing.last_login;
        const yesterday   = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastLogin === today) {
          setStreak(existing.current_streak);
          setLongestStreak(existing.longest_streak);
          return;
        }

        const newStreak  = lastLogin === yesterdayStr ? existing.current_streak + 1 : 1;
        const newLongest = Math.max(newStreak, existing.longest_streak);

        await supabase.from('user_streaks').update({
          current_streak: newStreak, last_login: today, longest_streak: newLongest,
        }).eq('user_id', userId);

        setStreak(newStreak); setLongestStreak(newLongest);
      }
    } catch (err) {
      console.log('Streak error:', err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      setUserName(data.user.user_metadata.name || 'Friend');
      await earnBadge('first_login', 'First Login', '🏅');
      await updateStreak(data.user.id);
    };
    getUser();

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    setDailyTip(DAILY_TIPS[dayOfYear % DAILY_TIPS.length]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    document.body.style.background = darkMode ? '#1a1a2e' : '';
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage    = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Nivaora Assistant — a helpful chatbot for the Nivaora home design app.
              Nivaora has these features:
              1. Plan My Home 2. Decor Ideas 3. Waste to Decor 4. Budget Planner
              5. Vastu Guide 6. Saved Designs 7. Wall Color Visualizer 8. Floor Plan
              9. Community Feed 10. Achievement Badges 11. Before & After Transformation
              12. Garden Planner 13. Seasonal Home Guide 14. Maintenance Reminders
              15. Carbon Footprint Score
              Answer questions about these features or general home design. Be friendly and helpful.`
          },
          ...updatedMessages
        ]
      })
    });
    const data = await response.json();
    setMessages([...updatedMessages, { role: 'assistant', content: data.choices[0].message.content }]);
    setLoading(false);
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') sendMessage(); };

  const getStreakEmoji = (s) => {
    if (s >= 30) return '🏆';
    if (s >= 14) return '⚡';
    if (s >= 7)  return '🔥';
    if (s >= 3)  return '✨';
    return '🌱';
  };

  // ── Filtered features for grid (when searching) ─────────────
  const displayFeatures = searchQuery.trim()
    ? searchResults
    : t.features.map((f, i) => ({ ...f, path: paths[i] }));

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div>
          <h1>{t.welcome}, {userName}! 🏡</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="header-btns">
          <Notifications />

          {/* 🔍 Search Bar */}
          <div className="search-wrapper" ref={searchRef}>
            <div className={`search-box ${darkMode ? 'search-dark' : ''}`}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
                onFocus={() => searchQuery && setShowDropdown(true)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={clearSearch}>✕</button>
              )}
            </div>

            {showDropdown && (
              <div className={`search-dropdown ${darkMode ? 'search-dropdown-dark' : ''}`}>
                {searchResults.length > 0 ? (
                  searchResults.map((f, i) => (
                    <div
                      key={f.path}
                      className={`search-result-item ${i === activeIdx ? 'search-active' : ''}`}
                      onClick={() => goToFeature(f.path)}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <span className="result-icon">{f.icon}</span>
                      <div className="result-text">
                        <span className="result-name">{f.title}</span>
                        <span className="result-desc">{f.desc}</span>
                      </div>
                      <span className="result-arrow">→</span>
                    </div>
                  ))
                ) : (
                  <div className="search-no-result">😕 {t.noResults} "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="dark-btn">
            {darkMode ? t.light : t.dark}
          </button>
          <div className="lang-toggle">
            <button onClick={() => setLang('en')} className={`lang-btn ${lang === 'en' ? 'active' : ''}`}>EN</button>
            <button onClick={() => setLang('te')} className={`lang-btn ${lang === 'te' ? 'active' : ''}`}>తె</button>
            <button onClick={() => setLang('hi')} className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}>हि</button>
          </div>
          <button onClick={() => navigate('/profile')} className="profile-btn">{t.profile}</button>
          <button onClick={handleLogout} className="logout-btn">{t.logout}</button>
        </div>
      </div>

      {/* ── Streak + Daily Tip Row ── */}
      <div className="dashboard-top-row">
        {streak > 0 && (
          <div className={`streak-card ${darkMode ? 'dark-streak' : ''}`}>
            <div className="streak-emoji">{getStreakEmoji(streak)}</div>
            <div className="streak-info">
              <span className="streak-num">{streak}</span>
              <span className="streak-label">{t.streakLabel}</span>
            </div>
            <div className="streak-divider" />
            <div className="streak-info">
              <span className="streak-num">{longestStreak}</span>
              <span className="streak-label">{t.longestLabel}</span>
            </div>
          </div>
        )}

        {dailyTip && (
          <div className={`daily-tip ${darkMode ? 'dark-tip' : ''}`}>
            <span className="tip-label">{t.tipTitle}</span>
            <p className="tip-text">{dailyTip}</p>
          </div>
        )}
      </div>

      {/* ── Features Grid ── */}
      <div className="features-grid">
        {displayFeatures.map((f, i) => (
          <div
            key={f.path || i}
            className={`feature-card ${darkMode ? 'dark-card' : ''}`}
            onClick={() => navigate(f.path)}
          >
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
        {searchQuery.trim() && searchResults.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px' }}>
            😕 {t.noResults} "{searchQuery}"
          </div>
        )}
      </div>

      {/* ── Chat Button ── */}
      <div className="chat-float-btn" onClick={() => setChatOpen(!chatOpen)}>
        <span>🧑‍💼</span>
      </div>

      {chatOpen && (
        <div className="chat-window">
          <div className="chat-window-header">
            <span>🧑‍💼 Nivaora Assistant</span>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div className="chat-window-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className="message-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-bubble typing">Typing...</div>
              </div>
            )}
          </div>
          <div className="chat-window-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;s