import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FloorPlan.css';

function FloorPlan() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRoom, setCurrentRoom] = useState('Bedroom');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const roomTypes = ['Bedroom', 'Living Room', 'Kitchen', 'Bathroom', 'Balcony', 'Pooja Room', 'Dining Room', 'Study Room'];

  const roomColors = {
    'Bedroom': '#bbdefb',
    'Living Room': '#c8e6c9',
    'Kitchen': '#ffe0b2',
    'Bathroom': '#e1bee7',
    'Balcony': '#f0f4c3',
    'Pooja Room': '#fce4ec',
    'Dining Room': '#fff9c4',
    'Study Room': '#b2dfdb',
  };

  useEffect(() => {
    drawCanvas();
  }, [rooms]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Rooms
    rooms.forEach((room, i) => {
      ctx.fillStyle = roomColors[room.type] || '#f5f5f5';
      ctx.fillRect(room.x, room.y, room.width, room.height);
      ctx.strokeStyle = selectedRoom === i ? '#f5a623' : '#333';
      ctx.lineWidth = selectedRoom === i ? 3 : 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);
      ctx.fillStyle = '#333';
      ctx.font = 'bold 13px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.type, room.x + room.width / 2, room.y + room.height / 2 - 6);
      ctx.font = '11px Arial';
      ctx.fillText(`${Math.abs(Math.round(room.width/20))}x${Math.abs(Math.round(room.height/20))}`, room.x + room.width / 2, room.y + room.height / 2 + 10);
    });
  };

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) / 20) * 20,
      y: Math.round((clientY - rect.top) / 20) * 20,
    };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);

    // Check if clicking existing room
    const clickedIndex = rooms.findIndex(r =>
      pos.x >= r.x && pos.x <= r.x + r.width &&
      pos.y >= r.y && pos.y <= r.y + r.height
    );

    if (clickedIndex !== -1) {
      setSelectedRoom(clickedIndex);
      return;
    }

    setSelectedRoom(null);
    setDrawing(true);
    setStartPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    const ctx = canvas.getContext('2d');

    drawCanvas();
    ctx.fillStyle = roomColors[currentRoom] + '99';
    ctx.fillRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    ctx.strokeStyle = '#f5a623';
    ctx.lineWidth = 2;
    ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
  };

  const handleMouseUp = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    const width = pos.x - startPos.x;
    const height = pos.y - startPos.y;

    if (Math.abs(width) > 20 && Math.abs(height) > 20) {
      setRooms([...rooms, {
        x: width > 0 ? startPos.x : pos.x,
        y: height > 0 ? startPos.y : pos.y,
        width: Math.abs(width),
        height: Math.abs(height),
        type: currentRoom
      }]);
    }
    setDrawing(false);
  };

  const deleteSelected = () => {
    if (selectedRoom === null) return;
    setRooms(rooms.filter((_, i) => i !== selectedRoom));
    setSelectedRoom(null);
  };

  const clearAll = () => {
    setRooms([]);
    setSelectedRoom(null);
  };

  const downloadPlan = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'nivaora-floor-plan.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getAiSuggestions = async () => {
    if (rooms.length === 0) return;
    setAiLoading(true);
    const roomList = rooms.map(r => r.type).join(', ');
    const prompt = `I have a floor plan with these rooms: ${roomList}. Give me 5 specific interior design and vastu tips for this layout. Keep it concise and practical for Indian homes.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    setAiSuggestion(data.choices[0].message.content);
    setAiLoading(false);
  };

  return (
    <div className="floorplan-container">
      <div className="floorplan-box">
        <h1>Floor Plan Drawer 🗺️</h1>
        <p>Draw your home layout and get AI suggestions!</p>

        <div className="floorplan-toolbar">
          <div className="room-selector">
            <label>Room Type:</label>
            <select value={currentRoom} onChange={(e) => setCurrentRoom(e.target.value)} className="room-select">
              {roomTypes.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="toolbar-btns">
            <button onClick={deleteSelected} className="btn-delete" disabled={selectedRoom === null}>
              🗑️ Delete Room
            </button>
            <button onClick={clearAll} className="btn-clear">
              🧹 Clear All
            </button>
            <button onClick={downloadPlan} className="btn-download" disabled={rooms.length === 0}>
              📥 Download
            </button>
          </div>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="floor-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        <p className="canvas-hint">💡 Click and drag to draw rooms. Click a room to select it.</p>

        {rooms.length > 0 && (
          <button onClick={getAiSuggestions} className="btn-primary" disabled={aiLoading}>
            {aiLoading ? 'Getting AI Tips...' : '🤖 Get AI Suggestions'}
          </button>
        )}

        {aiSuggestion && (
          <div className="ai-suggestion-box">
            <h3>🤖 AI Suggestions for Your Floor Plan:</h3>
            <p>{aiSuggestion}</p>
          </div>
        )}

        <div className="room-legend">
          {roomTypes.map((r, i) => (
            <div key={i} className="legend-item">
              <span className="legend-color" style={{ background: roomColors[r] }} />
              <span>{r}</span>
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

export default FloorPlan;