import React, { useState } from 'react';
import '../styles/Notifications.css';

const defaultNotifications = [
  { id: 1, icon: '🏠', title: 'Welcome to Nivaora!', desc: 'Start planning your dream home today.', time: 'Just now', read: false },
  { id: 2, icon: '💡', title: 'Decor Tip', desc: 'Try Bohemian style for your living room!', time: '2 mins ago', read: false },
  { id: 3, icon: '💰', title: 'Budget Reminder', desc: 'You have not set a budget yet. Plan now!', time: '1 hour ago', read: true },
  { id: 4, icon: '🕉️', title: 'Vastu Tip', desc: 'North-East corner should always be clutter-free.', time: 'Yesterday', read: true },
];

function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(defaultNotifications);

  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const markOne = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>🔔 Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          <div className="notif-list">
            {notifs.length === 0 ? (
              <p className="notif-empty">No notifications!</p>
            ) : (
              notifs.map(n => (
                <div
                  key={n.id}
                  className={`notif-item ${n.read ? 'read' : 'unread'}`}
                  onClick={() => markOne(n.id)}
                >
                  <span className="notif-icon">{n.icon}</span>
                  <div className="notif-content">
                    <strong>{n.title}</strong>
                    <p>{n.desc}</p>
                    <small>{n.time}</small>
                  </div>
                  {!n.read && <span className="notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;