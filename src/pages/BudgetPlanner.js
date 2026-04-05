import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BudgetPlanner.css';
import jsPDF from 'jspdf';
import { earnBadge } from '../utils/badgeHelper';

function BudgetPlanner() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const getPlan = async () => {
    setLoading(true);
    await earnBadge('budget_master', 'Budget Master', '💰');
    const prompt = `You are a home construction budget expert in India.
    Total Budget: ${budget} rupees
    Give a detailed budget breakdown for building and decorating a home in India including construction, interior, furniture, kitchen, bathroom, garden, electrical, plumbing and miscellaneous. Give exact amounts and money saving tips.`;

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
    setPlan(data.choices[0].message.content);
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Nivaora — Budget Plan', 20, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(plan, 170);
    doc.text(lines, 20, 40);
    doc.save('nivaora-budget-plan.pdf');
  };

  return (
    <div className="budget-container">
      <div className="budget-box">
        <h1>Budget Planner 💰</h1>
        <p>Plan your home budget smartly with AI!</p>

        <div className="input-group">
          <h3>Enter your total budget (in rupees):</h3>
          <input
            type="number"
            placeholder="e.g. 5000000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {budget && (
          <button onClick={getPlan} className="btn-primary">
            Generate Budget Plan ✨
          </button>
        )}

        {loading && <p className="loading">AI is creating your budget plan...</p>}

        {plan && (
          <div className="plan-content">
            <p>{plan}</p>
          </div>
        )}

        {plan && (
          <button onClick={downloadPDF} className="btn-download">
            📥 Download Budget Plan
          </button>
        )}

        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default BudgetPlanner;