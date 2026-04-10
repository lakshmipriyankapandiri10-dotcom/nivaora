import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const features = [
  { name: "Profile Photo Upload", path: "/profile",       icon: "📸", desc: "Upload & update your profile photo" },
  { name: "Share Designs",        path: "/share",         icon: "🔗", desc: "Share your designs with others" },
  { name: "PDF Download",         path: "/pdf",           icon: "📄", desc: "Download your work as PDF" },
  { name: "PWA Install",          path: "/install",       icon: "📱", desc: "Install app on your device" },
  { name: "Daily Tips",           path: "/tips",          icon: "💡", desc: "Get daily design tips" },
  { name: "Streak Counter",       path: "/streak",        icon: "🔥", desc: "Track your daily login streak" },
  { name: "User Stats",           path: "/stats",         icon: "📊", desc: "View your usage statistics" },
  { name: "Settings",             path: "/settings",      icon: "⚙️",  desc: "App settings & preferences" },
  { name: "Notifications",        path: "/notifications", icon: "🔔", desc: "Manage your notifications" },
];

function getStreakEmoji(streak) {
  if (streak >= 30) return "🏆";
  if (streak >= 14) return "⚡";
  if (streak >= 7)  return "🔥";
  if (streak >= 3)  return "✨";
  return "🌱";
}

export default function Dashboard() {
  const navigate  = useNavigate();
  const searchRef = useRef(null);

  // ── Streak ──────────────────────────────────────────────────
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const lastLogin = localStorage.getItem("lastLogin");
    let current     = parseInt(localStorage.getItem("streakCount") || "0");
    let best        = parseInt(localStorage.getItem("bestStreak")  || "0");

    if (lastLogin !== today) {
      current = lastLogin === yesterday ? current + 1 : 1;
      if (current > best) best = current;
      localStorage.setItem("lastLogin",   today);
      localStorage.setItem("streakCount", String(current));
      localStorage.setItem("bestStreak",  String(best));
    }

    setStreak(current);
    setBestStreak(best);
  }, []);

  // ── Search ──────────────────────────────────────────────────
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setShowResults(false); setActiveIdx(-1); return; }
    const matched = features.filter(
      (f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)
    );
    setResults(matched);
    setShowResults(true);
    setActiveIdx(-1);
  }, [query]);

  const handleKeyDown = (e) => {
    if (!showResults || !results.length) return;
    if      (e.key === "ArrowDown")              setActiveIdx((p) => (p + 1) % results.length);
    else if (e.key === "ArrowUp")                setActiveIdx((p) => (p - 1 + results.length) % results.length);
    else if (e.key === "Enter" && activeIdx >= 0) goTo(results[activeIdx].path);
    else if (e.key === "Escape")                 clearSearch();
  };

  const goTo = (path) => { navigate(path); clearSearch(); };
  const clearSearch = () => { setQuery(""); setShowResults(false); setActiveIdx(-1); };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">🎨 My Dashboard</h1>

        {/* Search Bar */}
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowResults(true)}
            />
            {query && (
              <button className="search-clear" onClick={clearSearch}>✕</button>
            )}
          </div>

          {showResults && (
            <div className="search-dropdown">
              {results.length > 0 ? (
                results.map((f, i) => (
                  <div
                    key={f.path}
                    className={`search-result-item ${i === activeIdx ? "active" : ""}`}
                    onClick={() => goTo(f.path)}
                    onMouseEnter={() => setActiveIdx(i)}
                  >
                    <span className="result-icon">{f.icon}</span>
                    <div className="result-text">
                      <span className="result-name">{f.name}</span>
                      <span className="result-desc">{f.desc}</span>
                    </div>
                    <span className="result-arrow">→</span>
                  </div>
                ))
              ) : (
                <div className="search-no-result">😕 No results for "{query}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Streak Banner */}
      <div className="streak-banner">
        <div className="streak-item">
          <span className="streak-emoji">{getStreakEmoji(streak)}</span>
          <div>
            <p className="streak-label">Current Streak</p>
            <p className="streak-value">{streak} day{streak !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="streak-divider" />
        <div className="streak-item">
          <span className="streak-emoji">🏆</span>
          <div>
            <p className="streak-label">Best Streak</p>
            <p className="streak-value">{bestStreak} day{bestStreak !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="features-grid">
        {features.map((f) => (
          <div key={f.path} className="feature-card" onClick={() => navigate(f.path)}>
            <span className="feature-icon">{f.icon}</span>
            <p className="feature-name">{f.name}</p>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}