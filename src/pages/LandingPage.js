import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const ALL_FEATURES = [
  { icon: '🏗️', name: 'Plan My Home', desc: 'Answer 8 questions and get AI powered home design suggestions tailored to your plot, city, and budget.' },
  { icon: '🏠', name: 'Decor Ideas', desc: 'Get room by room decoration ideas with real images based on your preferred style — Modern, Traditional, Bohemian and more.' },
  { icon: '♻️', name: 'Waste to Decor', desc: 'Turn your waste materials like old bottles, tyres, and wood into beautiful home decor with creative AI ideas.' },
  { icon: '💰', name: 'Budget Planner', desc: 'Get a detailed budget breakdown for your entire home construction and decoration in Indian rupees.' },
  { icon: '🕉️', name: 'Vastu Guide', desc: 'Get Vastu Shastra compliant tips for every room based on your house facing direction.' },
  { icon: '❤️', name: 'Saved Designs', desc: 'Save your favorite home design ideas and access them anytime from your personal collection.' },
  { icon: '📸', name: 'Photo Analyze', desc: 'Upload your room photo, select your preferred style, and get AI powered improvement suggestions.' },
  { icon: '📊', name: 'Progress Tracker', desc: 'Track your home building or renovation journey stage by stage and mark tasks as complete.' },
  { icon: '🎨', name: 'Wall Color Visualizer', desc: 'Pick colors from a palette and visualize how your walls would look before painting.' },
  { icon: '🗺️', name: 'Floor Plan', desc: 'Draw your home layout on a canvas and plan room placements before construction.' },
  { icon: '🌐', name: 'Community Feed', desc: 'Share your home transformations and get inspired by real Indian home designs from the community.' },
  { icon: '🏆', name: 'Achievement Badges', desc: 'Earn badges as you explore different features — making your home design journey fun and rewarding.' },
  { icon: '✨', name: 'Before & After Transformation', desc: 'Upload your room photo, choose a style, and get a complete AI transformation plan with cost estimates and product recommendations.' },
  { icon: '🌿', name: 'Garden Planner', desc: 'Get a complete garden plan based on your city and season — with plant suggestions, flower recommendations, and Amazon shopping links.' },
  { icon: '🗓️', name: 'Seasonal Home Guide', desc: 'Get home tips, decor ideas, and shopping lists for every Indian season and festival — including Diwali, Holi, and Monsoon.' },
  { icon: '🔔', name: 'Maintenance Reminders', desc: 'Never forget important home maintenance tasks — add reminders, set due dates, and track what is done.' },
  { icon: '🌱', name: 'Carbon Footprint Score', desc: 'Answer 5 questions about your home and get an eco-friendliness score out of 100 with specific improvements.' },
  { icon: '🧑‍💼', name: 'AI Assistant', desc: 'Chat with our AI assistant anytime for help with home design questions, feature guidance, and tips.' },
  { icon: '💡', name: 'Daily Tips', desc: 'Get a fresh home design tip every day on your dashboard to keep improving your living space.' },
  { icon: '🔥', name: 'Streak Counter', desc: 'Build a daily login streak and track your longest streak — staying consistent with your home journey.' },
];

function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="nav-logo">🏡 Nivaora</div>
        <div className="nav-links">
          <span onClick={() => scrollTo('home')}>Home</span>
          <span onClick={() => scrollTo('features')}>Features</span>
          <span onClick={() => scrollTo('about')}>About</span>
        </div>
        <div className="nav-btns">
          <button onClick={() => navigate('/login')} className="nav-login">Login</button>
          <button onClick={() => navigate('/signup')} className="nav-signup">Get Started</button>
        </div>
      </nav>

      <div className="landing-content" id="home">
        <h1>Nivaora</h1>
        <p className="tagline">From land to living.</p>
        <p className="description">
          Your complete AI powered home journey companion.
          From empty plot to beautifully decorated home.
        </p>
        <button onClick={() => navigate('/signup')} className="btn-primary">
          Get Started
        </button>
        <button onClick={() => navigate('/login')} className="btn-secondary">
          Login
        </button>
      </div>

      <div className="features-section" id="features">
        <h2>Our Features</h2>
        <p>Everything you need for your dream home — 20+ AI powered features</p>

        <div className="features-list-simple">
          {ALL_FEATURES.map((f, i) => (
            <div key={i} className="feature-list-item">
              <div className="feature-list-icon">{f.icon}</div>
              <div className="feature-list-content">
                <h3>{f.name}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section" id="about">
        <h2>About Nivaora</h2>
        <p className="about-desc">
          Nivaora is an AI powered home journey companion built for Indian homeowners.
          We understand that building and decorating a home is one of life's biggest decisions.
          Our platform combines artificial intelligence with deep knowledge of Indian home design,
          Vastu Shastra, and local budgets to give you the most relevant and practical guidance.
        </p>
        <div className="about-stats">
          <div className="stat">
            <h3>20+</h3>
            <p>AI Features</p>
          </div>
          <div className="stat">
            <h3>100%</h3>
            <p>Free to Use</p>
          </div>
          <div className="stat">
            <h3>🇮🇳</h3>
            <p>Made for India</p>
          </div>
          <div className="stat">
            <h3>3</h3>
            <p>Languages</p>
          </div>
        </div>
        <button onClick={() => navigate('/signup')} className="btn-primary">
          Start Your Journey
        </button>
      </div>

      <div className="footer">
        <p>© 2025 Nivaora — From land to living 🏡</p>
      </div>
    </div>
  );
}

export default LandingPage;