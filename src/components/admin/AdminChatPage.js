import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
  useTheme,
  Paper,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import Header from '../common/Header';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Attendance Records', icon: <EventAvailableIcon />, path: '/admin/attendance-records' },
    { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/manage-users' },
    { text: 'Chat', icon: <ChatIcon />, path: '/admin/chat' }
  ];

  const drawerWidth = 240;

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', overflowX: 'hidden' }}>
          <MuiList>
            {menuItems.map((item) => (
              <MuiListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <MuiListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    } 
                  }} 
                />
              </MuiListItem>
            ))}
          </MuiList>
        </Box>
      </Drawer>
      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <MuiList>
            {menuItems.map((item) => (
              <MuiListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                      color: theme.palette.primary.main
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <MuiListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    } 
                  }} 
                />
              </MuiListItem>
            ))}
          </MuiList>
        </Box>
      </Drawer>
    </>
  );
};

const AdminChatPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || userData.role !== 'admin') {
          navigate('/');
          return;
        }

        // Fetch users
        const response = await fetch(API_ENDPOINTS.users.list);
        if (response.ok) {
          const data = await response.json();
          const usersArray = data.success && data.users ? data.users : (Array.isArray(data) ? data : []);
          // Filter admins
          const nonAdminUsers = usersArray.filter(user => user.role !== 'admin');
          setUsers(nonAdminUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser) {
        fetchMessages();
      }
    }, 3000); // Poll every 3s

    return () => clearInterval(interval);
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      // Fetch messages
      const response = await fetch(`${API_ENDPOINTS.messages.getByUser(1)}?chat_type=personal&receiver_id=${selectedUser.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter messages
          const filteredMessages = (data.messages || []).filter(msg => 
            (msg.sender_id === 1 && msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.receiver_id === 1)
          );
          setMessages(filteredMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const messageData = {
        sender_id: 1, // Admin ID
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        type: 'personal',
        timestamp: new Date().toISOString() // Ensure proper timestamp
      };

      const response = await fetch(API_ENDPOINTS.messages.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setNewMessage('');
        // Fetch messages immediately to show the new message
        setTimeout(() => fetchMessages(), 100);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleMessageMenuOpen = (event, message) => {
    setMessageMenuAnchor(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMessageMenuClose = () => {
    setMessageMenuAnchor(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(API_ENDPOINTS.messages.delete(selectedMessage.id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove message from local state
        setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
        handleMessageMenuClose();
      } else {
        
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Shift+Enter for new line
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header onMenuClick={handleDrawerToggle} />
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: '240px' },
            backgroundColor: theme.palette.grey[50],
            overflow: 'hidden',
            maxWidth: '100vw'
          }}
        >
          <Container maxWidth="xl">
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                color: theme.palette.text.primary
              }}
            >
              Admin Chat
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              height: { xs: 'auto', md: 'calc(100vh - 200px)' },
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              {/* Users List */}
              <Card sx={{ 
                width: { xs: '100%', md: 300 }, 
                height: { xs: 'auto', md: 'fit-content' },
                maxHeight: { xs: '300px', md: '500px' }
              }}>
                <CardHeader title="Users" />
                <CardContent sx={{ 
                  p: 0, 
                  maxHeight: { xs: 250, md: 400 }, 
                  overflow: 'auto' 
                }}>
                  <List>
                    {users.map((user) => (
                      <ListItem 
                        key={user.id}
                        button 
                        selected={selectedUser?.id === user.id}
                        onClick={() => handleUserSelect(user)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {user.full_name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={user.full_name}
                          secondary={`Emp Code: ${user.employee_code} | ${user.department || '-'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                height: { xs: '500px', md: 'auto' }
              }}>
                <CardHeader 
                  title={selectedUser ? `Chat with ${selectedUser.full_name}` : 'Select a user to chat'}
                  subheader={selectedUser ? `${selectedUser.department || '-'} Department` : ''}
                />
                <CardContent sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                  {selectedUser ? (
                    <>
                      <Box sx={{ 
                        flex: 1, 
                        p: 2, 
                        overflow: 'auto', 
                        maxHeight: { xs: '300px', md: '400px' }
                      }}>
                        {messages.length === 0 ? (
                          <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                            <Typography>No messages yet. Start the conversation!</Typography>
                          </Box>
                        ) : (
                          messages.map((message, index) => {
                            const showDateHeader = index === 0 || 
                              formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);
                            
                            return (
                              <Fragment key={message.id}>
                                {showDateHeader && (
                                  <Box sx={{ textAlign: 'center', my: 2 }}>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        backgroundColor: theme.palette.grey[200],
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
                                        color: theme.palette.text.secondary
                                      }}
                                    >
                                      {formatDate(message.timestamp)}
                                    </Typography>
                                  </Box>
                                )}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: message.sender_id === 1 ? 'flex-end' : 'flex-start',
                                    mb: 2
                                  }}
                                >
                                  <Paper
                                    sx={{
                                      p: 2,
                                      maxWidth: '70%',
                                      backgroundColor: message.sender_id === 1 
                                        ? theme.palette.primary.main 
                                        : theme.palette.grey[100],
                                      color: message.sender_id === 1 
                                        ? 'white' 
                                        : 'text.primary',
                                      borderRadius: 2,
                                      position: 'relative'
                                    }}
                                  >
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                      }}
                                    >
                                      {message.content}
                                    </Typography>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      mt: 0.5 
                                    }}>
                                      <Typography 
                                        variant="caption" 
                                        sx={{ 
                                          opacity: 0.7
                                        }}
                                      >
                                        {formatTime(message.timestamp)}
                                      </Typography>
                                      {message.sender_id === 1 && (
                                        <Tooltip title="Message options">
                                          <IconButton
                                            size="small"
                                            onClick={(e) => handleMessageMenuOpen(e, message)}
                                            sx={{ 
                                              opacity: 0.7,
                                              '&:hover': { opacity: 1 },
                                              color: 'inherit'
                                            }}
                                          >
                                            <MoreVertIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Box>
                                  </Paper>
                                </Box>
                              </Fragment>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </Box>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          variant="outlined"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="Send message">
                                  <IconButton
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                    color="primary"
                                  >
                                    <SendIcon />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'text.secondary'
                    }}>
                      <Typography>Select a user to start chatting</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Message Options Menu */}
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={handleMessageMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem 
          onClick={handleDeleteMessage}
          disabled={isDeleting}
          sx={{ color: 'error.main' }}
        >
          {isDeleting ? 'Deleting...' : 'Unsend'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default AdminChatPage;
