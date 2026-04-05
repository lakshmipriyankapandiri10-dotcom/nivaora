import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

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
        <p>Everything you need for your dream home</p>
        <div className="features-list">
          <div className="feature-item">
            <span>🏗️</span>
            <h3>Plan My Home</h3>
            <p>Answer 8 simple questions and get AI powered home design suggestions tailored to your needs.</p>
          </div>
          <div className="feature-item">
            <span>🏠</span>
            <h3>Decor Ideas</h3>
            <p>Get room by room decoration ideas with real images based on your preferred style.</p>
          </div>
          <div className="feature-item">
            <span>♻️</span>
            <h3>Waste to Decor</h3>
            <p>Turn your waste materials into beautiful home decor with creative AI ideas.</p>
          </div>
          <div className="feature-item">
            <span>💰</span>
            <h3>Budget Planner</h3>
            <p>Get a detailed budget breakdown for your entire home construction and decoration.</p>
          </div>
          <div className="feature-item">
            <span>🕉️</span>
            <h3>Vastu Guide</h3>
            <p>Get Vastu Shastra tips for every room based on your house facing direction.</p>
          </div>
          <div className="feature-item">
            <span>🧑‍💼</span>
            <h3>AI Assistant</h3>
            <p>Chat with our AI assistant anytime for help with home design questions.</p>
          </div>
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
            <h3>6+</h3>
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
        </div>
        <button onClick={() => navigate('/signup')} className="btn-primary">
          Start Your Journey
        </button>
      </div>

      <div className="footer">
        <p>© 2024 Nivaora — From land to living 🏡</p>
      </div>
    </div>
  );
}

export default LandingPage;