import React, { useState, useEffect, useRef } from 'react';
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
  InputAdornment
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: 0,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: 'white'
          }}
        >
          Admin Chat
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                color: 'white',
                fontWeight: 500,
                display: { xs: 'none', sm: 'inline' }
              }}
            >
              Welcome, {user.full_name}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                color: 'white',
                borderRadius: '24px',
                px: 3,
                py: 1,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

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
        <Box sx={{ overflow: 'auto' }}>
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
        <Box sx={{ overflow: 'auto' }}>
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

        // Fetch all users
        const response = await fetch(API_ENDPOINTS.users.list);
        if (response.ok) {
          const data = await response.json();
          const usersArray = data.success && data.users ? data.users : (Array.isArray(data) ? data : []);
          // Filter out admin users
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

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser) {
        fetchMessages();
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      // Fetch admin messages with the selected user
      const response = await fetch(`${API_ENDPOINTS.messages.getByUser('admin')}?chat_type=admin&receiver_id=${selectedUser.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter messages between admin and selected user
          const filteredMessages = (data.messages || []).filter(msg => 
            msg.type === 'admin' && (
              (msg.sender_id === 'admin' && msg.receiver_id === selectedUser.id) ||
              (msg.sender_id === selectedUser.id && msg.receiver_id === 'admin')
            )
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
        sender_id: 'admin',
        receiver_id: selectedUser.id,
        content: newMessage.trim(),
        type: 'admin'
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
        fetchMessages();
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
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminHeader onMenuClick={handleDrawerToggle} />
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
              <CardContent sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
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
                        secondary={`Emp Code: ${user.employee_code} | ${user.department || 'General'}`}
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
                subheader={selectedUser ? `${selectedUser.department || 'General'} Department` : ''}
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
                        messages.map((message) => (
                          <Box
                            key={message.id} 
                            sx={{
                              display: 'flex',
                              justifyContent: message.sender_id === 'admin' ? 'flex-end' : 'flex-start',
                              mb: 2
                            }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                maxWidth: '70%',
                                backgroundColor: message.sender_id === 'admin' 
                                  ? theme.palette.primary.main 
                                  : theme.palette.grey[100],
                                color: message.sender_id === 'admin' 
                                  ? 'white' 
                                  : 'text.primary'
                              }}
                            >
                              <Typography variant="body1">{message.content}</Typography>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  opacity: 0.7,
                                  display: 'block',
                                  mt: 0.5
                                }}
                              >
                                {formatTime(message.timestamp)}
                              </Typography>
                            </Paper>
                          </Box>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                color="primary"
                              >
                                <SendIcon />
                              </IconButton>
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
  );
};

export default AdminChatPage;
