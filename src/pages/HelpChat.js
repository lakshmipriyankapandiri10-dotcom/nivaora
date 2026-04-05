import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HelpChat.css';

function HelpChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I am Nivaora Assistant. Ask me anything about using this app or home design!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
              1. Plan My Home — users answer 8 questions about their plot, house type, style, budget etc and get AI home design suggestions
              2. Decor Ideas — users select room and style and get AI decoration ideas with images
              3. Waste to Decor — users enter waste materials and get creative upcycling ideas
              4. Budget Planner — users enter budget and get detailed cost breakdown
              5. Vastu Guide — users select room and direction and get Vastu tips
              6. Saved Designs — users can view their saved designs
              Answer any questions about these features or general home design questions. Be friendly and helpful.`
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
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          <h1>🏡 Nivaora Assistant</h1>
          <button onClick={() => navigate('/dashboard')} className="close-btn">✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="message-bubble">
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-bubble typing">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage} className="send-btn">
            Send ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpChat;