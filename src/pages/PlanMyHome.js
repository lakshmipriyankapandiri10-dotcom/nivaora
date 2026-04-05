import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/PlanMyHome.css';

function PlanMyHome() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    plotSize: '', city: '', houseType: '',
    floors: '', bedrooms: '', style: '',
    colors: '', budget: ''
  });

  const questions = [
    { key: 'plotSize', question: 'What is your plot size?', options: ['Below 500 sq ft', '500-1000 sq ft', '1000-2000 sq ft', 'Above 2000 sq ft'] },
    { key: 'city', question: 'Which city are you building in?', type: 'input', placeholder: 'Enter your city name' },
    { key: 'houseType', question: 'What type of home do you want?', options: ['Independent House', 'Villa', 'Farmhouse', 'Duplex'] },
    { key: 'floors', question: 'How many floors?', options: ['Single Floor', '2 Floors', '3 Floors', 'More than 3'] },
    { key: 'bedrooms', question: 'How many bedrooms?', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] },
    { key: 'style', question: 'What style do you prefer?', options: ['Modern', 'Traditional', 'Minimalist', 'Royal'] },
    { key: 'colors', question: 'Preferred color theme?', options: ['Warm Tones', 'Cool Tones', 'Earthy Tones', 'Neutral Tones'] },
    { key: 'budget', question: 'What is your budget?', options: ['Below 20L', '20L-50L', '50L-1Cr', 'Above 1Cr'] },
  ];

  const handleAnswer = (key, value) => {
    setAnswers({ ...answers, [key]: value });
    if (step < questions.length) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    
    await supabase
      .from('preferences')
      .delete()
      .eq('user_id', userData.user.id);

    await supabase.from('preferences').insert([{
      user_id: userData.user.id,
      plot_size: answers.plotSize,
      city: answers.city,
      house_type: answers.houseType,
      floors: answers.floors,
      bedrooms: answers.bedrooms,
      style: answers.style,
      colors: answers.colors,
      budget: answers.budget
    }]);
    navigate('/suggestions');
  };

  const current = questions[step - 1];

  return (
    <div className="plan-container">
      <div className="plan-box">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / questions.length) * 100}%` }}></div>
        </div>
        <p className="step-count">Step {step} of {questions.length}</p>
        <h2>{current.question}</h2>
        {current.type === 'input' ? (
          <div className="input-group">
            <input
              type="text"
              placeholder={current.placeholder}
              onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
            />
            <button onClick={() => handleAnswer(current.key, answers[current.key])} className="btn-primary">
              Next →
            </button>
          </div>
        ) : (
          <div className="options-grid">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(current.key, opt)} className="option-btn">
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanMyHome;