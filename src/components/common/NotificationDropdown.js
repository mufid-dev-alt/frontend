import React, { useState, useEffect } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import './NotificationDropdown.css';

const NotificationDropdown = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
      
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.notifications.list(currentUser.id));
      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.notifications.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.notifications.markAsRead(notificationId), {
        method: 'PUT'
      });
      
      if (response.success) {
        // Update local state
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.notifications.markAllAsRead, {
        method: 'PUT',
        body: JSON.stringify({ user_id: currentUser.id })
      });
      
      if (response.success) {
        // Update local state
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dropdown align="end" className="notification-dropdown">
      <Dropdown.Toggle variant="light" id="notification-dropdown">
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <Badge bg="danger" pill className="notification-badge">
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-menu">
        <div className="notification-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Notifications</h6>
          {unreadCount > 0 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 text-primary" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Dropdown.Divider />
        
        <div className="notification-list">
          {loading && notifications.length === 0 ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted py-3">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <Dropdown.Item 
                key={notification.id} 
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="notification-content">
                    <div className="notification-text">{notification.content}</div>
                    <div className="notification-time">{formatTime(notification.timestamp)}</div>
                  </div>
                  {!notification.is_read && <div className="unread-indicator"></div>}
                </div>
              </Dropdown.Item>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;