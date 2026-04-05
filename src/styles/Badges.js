.badges-container {
  min-height: 100vh;
  background: #f0f4f0;
  display: flex;
  justify-content: center;
  padding: 30px 20px;
}

.badges-box {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.badges-box h1 {
  font-size: 28px;
  color: #1e3a2f;
  margin-bottom: 6px;
  text-align: center;
}

.badges-box > p {
  color: #666;
  margin-bottom: 24px;
  text-align: center;
}

.badges-progress {
  margin-bottom: 30px;
}

.badges-progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: bold;
}

.badges-progress-bar {
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.badges-progress-fill {
  height: 12px;
  background: linear-gradient(90deg, #f5a623, #e09000);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.loading {
  text-align: center;
  color: #888;
  padding: 20px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.badge-card {
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.badge-card.earned {
  background: #f9fff9;
  border-color: #f5a623;
  box-shadow: 0 4px 15px rgba(245,166,35,0.15);
}

.badge-card.locked {
  background: #f5f5f5;
  opacity: 0.6;
}

.badge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.badge-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  transition: background 0.3s;
}

.badge-icon {
  font-size: 30px;
}

.badge-card h3 {
  color: #1e3a2f;
  font-size: 14px;
  margin-bottom: 6px;
}

.badge-card.locked h3 {
  color: #aaa;
}

.badge-card p {
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.badge-earned-label {
  font-size: 11px;
  color: #f5a623;
  font-weight: bold;
}

.btn-back {
  background: #1e3a2f;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
  width: 100%;
}

.btn-back:hover {
  background: #2d5a47;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .badges-container {
    padding: 16px 12px;
  }

  .badges-box {
    padding: 24px 16px;
    border-radius: 16px;
  }

  .badges-box h1 {
    font-size: 22px;
  }

  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .badge-card {
    padding: 14px 10px;
  }

  .badge-icon-wrap {
    width: 52px;
    height: 52px;
  }

  .badge-icon {
    font-size: 24px;
  }

  .badge-card h3 {
    font-size: 13px;
  }

  .badge-card p {
    font-size: 11px;
  }

  .btn-back {
    font-size: 14px;
    padding: 12px;
  }
}

@media (max-width: 400px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}