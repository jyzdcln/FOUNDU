import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('reports')
      .select(`
        id,
        type,
        title,
        status,
        created_at,
        users(name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("Error loading notifications:", error);
    } else {
      const formattedNotifications = data.map(report => {
        let message = "";
        let notifType = "report";
        
        if (report.type === "lost") {
          message = `Student reported a lost item: ${report.title}`;
          notifType = "lost";
        } else if (report.type === "found") {
          message = `Student reported a found item: ${report.title}`;
          notifType = "found";
        }
        
        if (report.status === "verified") {
          message = `${report.title} has been verified`;
          notifType = "verification";
        } else if (report.status === "claimed") {
          message = `${report.title} has been claimed`;
          notifType = "claim";
        }
        
        return {
          id: report.id,
          message: message,
          time: formatTimeAgo(report.created_at),
          read: false,
          type: notifType
        };
      });
      
      setNotifications(formattedNotifications);
    }
    setLoading(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-state">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-page-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>No notifications yet</p>
          <p className="empty-subtext">When students submit reports, you'll see them here</p>
        </div>
      ) : (
        <div className="notifications-page-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-page-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-page-content">
                <div className="notification-page-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {notification.type === 'lost' && (
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#dc2626" strokeWidth="2" fill="none"/>
                    )}
                    {notification.type === 'found' && (
                      <path d="M20 6L9 17L4 12" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                    {notification.type === 'verification' && (
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#2b5797" strokeWidth="2" fill="none"/>
                    )}
                    {notification.type === 'claim' && (
                      <path d="M20 7H4v10h16V7z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                </div>
                <div className="notification-page-details">
                  <p className="notification-page-message">{notification.message}</p>
                  <span className="notification-page-time">{notification.time}</span>
                </div>
              </div>
              <div className="notification-page-actions">
                {!notification.read && (
                  <button className="mark-read-btn" onClick={() => markAsRead(notification.id)}>
                    Mark as read
                  </button>
                )}
                <button className="delete-notif-btn" onClick={() => deleteNotification(notification.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;