import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Chip,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Chat as ChatIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { API_ENDPOINTS } from '../../config/api';

const NotificationDropdown = ({ currentUser, onNewNotification }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
      
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 10000); // Check every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    // Show toast notification for new messages
    if (unreadCount > previousCount && onNewNotification) {
      const newNotifications = notifications.filter(n => n.status === 'unread').slice(0, unreadCount - previousCount);
      newNotifications.forEach(notification => {
        onNewNotification(notification);
      });
    }
    setPreviousCount(unreadCount);
  }, [unreadCount, notifications, previousCount, onNewNotification]);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.notifications.list(currentUser.id));
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const newNotifications = data.notifications || [];
          setNotifications(newNotifications);
          setUnreadCount(newNotifications.filter(n => n.status === 'unread').length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(API_ENDPOINTS.notifications.markAsRead(notificationId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, status: 'read' } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.notifications.markAllAsRead, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'chat':
        return <ChatIcon fontSize="small" />;
      case 'team':
        return <GroupIcon fontSize="small" />;
      case 'admin':
        return <AdminIcon fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ 
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
              <Typography>No notifications</Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  backgroundColor: notification.status === 'unread' ? 'action.hover' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mb: 1 }}>
                  {getNotificationIcon(notification.type)}
                  <Typography variant="body2" sx={{ fontWeight: notification.status === 'unread' ? 600 : 400 }}>
                    {notification.content}
                  </Typography>
                  {notification.status === 'unread' && (
                    <Chip label="New" size="small" color="primary" />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatTime(notification.timestamp)}
                </Typography>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationDropdown;