import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import '../styles/MaintenanceReminder.css';

const CATEGORIES = ['Painting', 'Plumbing', 'Electrical', 'Garden', 'Cleaning', 'Pest Control', 'Roof', 'Other'];

const DEFAULT_REMINDERS = [
  { title: 'Repaint Walls', description: 'Repaint interior and exterior walls', category: 'Painting', due_date: '' },
  { title: 'Pre-Monsoon Roof Check', description: 'Check roof for leaks before monsoon season', category: 'Roof', due_date: '' },
  { title: 'Annual Pest Control', description: 'Get annual pest control done', category: 'Pest Control', due_date: '' },
  { title: 'Water Tank Cleaning', description: 'Clean overhead water tank', category: 'Cleaning', due_date: '' },
  { title: 'Garden Replanting', description: 'Replant garden for new season', category: 'Garden', due_date: '' },
];

const CATEGORY_ICONS = {
  'Painting': '🎨',
  'Plumbing': '🔧',
  'Electrical': '⚡',
  'Garden': '🌿',
  'Cleaning': '🧹',
  'Pest Control': '🐛',
  'Roof': '🏠',
  'Other': '📋',
};

function MaintenanceReminder() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Cleaning');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { navigate('/login'); return; }

    const { data } = await supabase
      .from('maintenance_reminders')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    setReminders(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title.trim() || !dueDate) return;
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    await supabase.from('maintenance_reminders').insert([{
      user_id: userData.user.id,
      title,
      description,
      due_date: dueDate,
      category,
      done: false,
    }]);

    setTitle('');
    setDescription('');
    setDueDate('');
    setCategory('Cleaning');
    setShowForm(false);
    setSaving(false);
    fetchReminders();
  };

  const handleAddDefault = async (reminder) => {
    const { data: userData } = await supabase.auth.getUser();
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    const defaultDate = today.toISOString().split('T')[0];

    await supabase.from('maintenance_reminders').insert([{
      user_id: userData.user.id,
      title: reminder.title,
      description: reminder.description,
      due_date: defaultDate,
      category: reminder.category,
      done: false,
    }]);
    fetchReminders();
  };

  const handleToggleDone = async (id, done) => {
    await supabase.from('maintenance_reminders').update({ done: !done }).eq('id', id);
    fetchReminders();
  };

  const handleDelete = async (id) => {
    await supabase.from('maintenance_reminders').delete().eq('id', id);
    fetchReminders();
  };

  const pendingCount = reminders.filter(r => !r.done).length;
  const doneCount = reminders.filter(r => r.done).length;

  return (
    <div className="mr-container">
      <div className="mr-header">
        <button onClick={() => navigate('/dashboard')} className="mr-back-btn">← Back</button>
        <h1>🔔 Maintenance Reminders</h1>
        <p>Never forget important home maintenance tasks!</p>
      </div>

      <div className="mr-content">
        {/* Left */}
        <div className="mr-left">
          {/* Stats */}
          <div className="mr-stats">
            <div className="mr-stat">
              <span className="mr-stat-num">{reminders.length}</span>
              <span className="mr-stat-label">Total</span>
            </div>
            <div className="mr-stat pending">
              <span className="mr-stat-num">{pendingCount}</span>
              <span className="mr-stat-label">Pending</span>
            </div>
            <div className="mr-stat done">
              <span className="mr-stat-num">{doneCount}</span>
              <span className="mr-stat-label">Done</span>
            </div>
          </div>

          {/* Add Button */}
          <button className="mr-add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Reminder'}
          </button>

          {/* Add Form */}
          {showForm && (
            <div className="mr-form">
              <h3>➕ New Reminder</h3>
              <input
                type="text"
                placeholder="Title (e.g. Fix leaking tap)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mr-input"
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mr-textarea"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mr-input"
              />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mr-select">
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
              <button className="mr-save-btn" onClick={handleAdd} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Reminder'}
              </button>
            </div>
          )}

          {/* Default Reminders */}
          <div className="mr-defaults">
            <h3>⚡ Quick Add</h3>
            {DEFAULT_REMINDERS.map((r, i) => (
              <div key={i} className="mr-default-item" onClick={() => handleAddDefault(r)}>
                <span>{CATEGORY_ICONS[r.category]}</span>
                <div>
                  <p className="mr-default-title">{r.title}</p>
                  <p className="mr-default-desc">{r.description}</p>
                </div>
                <span className="mr-default-add">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Reminders List */}
        <div className="mr-right">
          {loading && <div className="mr-loading">Loading reminders...</div>}

          {!loading && reminders.length === 0 && (
            <div className="mr-empty">
              <span>🔔</span>
              <h3>No reminders yet!</h3>
              <p>Add a reminder or use Quick Add to get started.</p>
            </div>
          )}

          {!loading && reminders.length > 0 && (
            <div className="mr-list">
              {reminders.map((r) => (
                <div key={r.id} className={`mr-item ${r.done ? 'done' : ''}`}>
                  <div className="mr-item-left">
                    <span className="mr-item-icon">{CATEGORY_ICONS[r.category] || '📋'}</span>
                    <div className="mr-item-info">
                      <h4 className={r.done ? 'done-text' : ''}>{r.title}</h4>
                      {r.description && <p>{r.description}</p>}
                      <div className="mr-item-meta">
                        <span className="mr-item-category">{r.category}</span>
                        <span className="mr-item-date">📅 {r.due_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mr-item-actions">
                    <button
                      className={`mr-done-btn ${r.done ? 'undo' : ''}`}
                      onClick={() => handleToggleDone(r.id, r.done)}
                    >
                      {r.done ? '↩️' : '✅'}
                    </button>
                    <button className="mr-delete-btn" onClick={() => handleDelete(r.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintenanceReminder;