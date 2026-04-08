import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Notifications from './Notifications';
import '../styles/Dashboard.css';
import { earnBadge } from '../utils/badgeHelper';

const translations = {
  en: {
    welcome: 'Welcome back',
    subtitle: 'What would you like to do today?',
    dark: '🌙 Dark',
    light: '☀️ Light',
    profile: '👤 Profile',
    logout: 'Logout',
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
    ]
  },
  te: {
    welcome: 'తిరిగి స్వాగతం',
    subtitle: 'ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?',
    dark: '🌙 డార్క్',
    light: '☀️ లైట్',
    profile: '👤 ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
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
    ]
  },
  hi: {
    welcome: 'वापस स्वागत है',
    subtitle: 'आज आप क्या करना चाहेंगे?',
    dark: '🌙 डार्क',
    light: '☀️ लाइट',
    profile: '👤 प्रोफाइल',
    logout: 'लॉगआउट',
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
    ]
  }
};

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I am Nivaora Assistant. Ask me anything about home design or this app!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate('/login'); return; }
      setUserName(data.user.user_metadata.name || 'Friend');
      await earnBadge('first_login', 'First Login', '🏅');
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.body.style.background = '#1a1a2e';
    } else {
      document.body.style.background = '';
    }
  }, [darkMode]);

  const paths = [
    '/plan', '/decor', '/waste', '/budget', '/vastu', '/saved',
    '/photo', '/progress', '/wallcolor', '/floorplan', '/community',
    '/badges', '/beforeafter', '/garden', '/seasonal'
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

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
          messages: [
            {
              role: 'system',
              content: `You are Nivaora Assistant — a helpful chatbot for the Nivaora home design app.
              Nivaora has these features:
              1. Plan My Home
              2. Decor Ideas
              3. Waste to Decor
              4. Budget Planner
              5. Vastu Guide
              6. Saved Designs
              7. Wall Color Visualizer
              8. Floor Plan Drawer
              9. Community Feed
              10. Achievement Badges
              11. Before & After Room Transformation
              12. Garden Planner
              13. Seasonal Home Guide
              Answer questions about these features or general home design. Be friendly and helpful.`
            },
            ...updatedMessages
          ]
        })
      }
    );
    const data = await response.json();
    const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
    setMessages([...updatedMessages, assistantMessage]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      <div className="dashboard-header">
        <div>
          <h1>{t.welcome}, {userName}! 🏡</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="header-btns">
          <Notifications />
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

      <div className="features-grid">
        {t.features.map((f, i) => (
          <div key={i} className={`feature-card ${darkMode ? 'dark-card' : ''}`} onClick={() => navigate(paths[i])}>
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

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

export default Dashboard;