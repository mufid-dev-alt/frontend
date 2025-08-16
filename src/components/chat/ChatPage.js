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
  Chip,
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
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton as MuiIconButton,
  InputAdornment
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const Header = ({ onMenuClick }) => {
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
          Team Chat
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Attendance', icon: <EventAvailableIcon />, path: '/attendance' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Team', icon: <GroupIcon />, path: '/team' }
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
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
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
                onClick={() => navigate(item.path)}
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

const ChatPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatType, setChatType] = useState('group'); // group, personal, admin
  const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/');
          return;
        }

        // Get user's department
        const deptResponse = await fetch(`${API_ENDPOINTS.teams.userDepartment.replace('{user_id}', userData.id)}`);
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          if (deptData.success) {
            setUserDepartment(deptData.department);
            
            // Get team members
            const teamResponse = await fetch(`${API_ENDPOINTS.teams.departmentMembers.replace('{department}', encodeURIComponent(deptData.department))}`);
            if (teamResponse.ok) {
              const teamData = await teamResponse.json();
              if (teamData.success) {
                setTeamMembers(teamData.members);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [navigate]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat, chatType]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages();
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      let url = `${API_ENDPOINTS.messages.getByUser(currentUser.id)}?chat_type=${chatType}`;
      
      // For personal chats, filter by specific recipient
      if (chatType === 'personal' && selectedChat.id) {
        url += `&receiver_id=${selectedChat.id}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter messages based on chat type and recipient
          let filteredMessages = data.messages || [];
          
          if (chatType === 'personal' && selectedChat.id) {
            // For personal chats, only show messages between current user and selected user
            filteredMessages = filteredMessages.filter(msg => 
              (msg.sender_id === currentUser.id && msg.receiver_id === selectedChat.id) ||
              (msg.sender_id === selectedChat.id && msg.receiver_id === currentUser.id)
            );
          } else if (chatType === 'group') {
            // For group chats, show all group messages
            filteredMessages = filteredMessages.filter(msg => msg.type === 'group');
          } else if (chatType === 'admin') {
            // For admin chats, show all admin messages
            filteredMessages = filteredMessages.filter(msg => msg.type === 'admin');
          }
          
          setMessages(filteredMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: chatType === 'group' ? 'group' : selectedChat.id,
        content: newMessage.trim(),
        type: chatType
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

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const handleChatTypeChange = (event, newValue) => {
    setChatType(newValue);
    setSelectedChat(null);
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
          backgroundColor: theme.palette.grey[50]
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
            Team Chat
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
            {/* Chat Types Tabs */}
            <Card sx={{ width: 300, height: 'fit-content' }}>
              <CardHeader title="Chat Types" />
              <CardContent sx={{ p: 0 }}>
                <Tabs 
                  value={chatType} 
                  onChange={handleChatTypeChange}
                  orientation="vertical"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GroupIcon />
                        <Typography>Group Chat</Typography>
                      </Box>
                    }
                    value="group"
                    sx={{ alignItems: 'flex-start', textAlign: 'left' }}
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon />
                        <Typography>Personal Chat</Typography>
                      </Box>
                    }
                    value="personal"
                    sx={{ alignItems: 'flex-start', textAlign: 'left' }}
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettingsIcon />
                        <Typography>Admin Chat</Typography>
                      </Box>
                    }
                    value="admin"
                    sx={{ alignItems: 'flex-start', textAlign: 'left' }}
                  />
                </Tabs>
              </CardContent>
            </Card>

            {/* Chat List */}
            <Card sx={{ width: 300 }}>
              <CardHeader title={
                chatType === 'group' ? 'Department Members' :
                chatType === 'personal' ? 'Team Members' :
                'Admin'
              } />
              <CardContent sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                {chatType === 'group' && (
                  <List>
                    <ListItem 
                      button 
                      selected={selectedChat?.type === 'group'}
                      onClick={() => handleChatSelect({ type: 'group', name: `${userDepartment} Group` })}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`${userDepartment} Group`}
                        secondary="Department group chat"
                      />
                    </ListItem>
                  </List>
                )}
                
                {chatType === 'personal' && (
                  <List>
                    {teamMembers.map((member) => (
                      <ListItem 
                        key={member.id}
                        button 
                        selected={selectedChat?.id === member.id}
                        onClick={() => handleChatSelect(member)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                            {member.full_name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={member.full_name}
                          secondary={`Emp Code: ${member.employee_code}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {chatType === 'admin' && (
                  <List>
                    <ListItem 
                      button 
                      selected={selectedChat?.type === 'admin'}
                      onClick={() => handleChatSelect({ type: 'admin', name: 'Admin' })}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                          <AdminPanelSettingsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary="Admin"
                        secondary="Chat with admin"
                      />
                    </ListItem>
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <CardHeader 
                title={selectedChat ? selectedChat.name || selectedChat.full_name : 'Select a chat'}
                subheader={selectedChat ? `Chat Type: ${chatType}` : ''}
              />
              <CardContent sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                {selectedChat ? (
                  <>
                    <Box sx={{ flex: 1, p: 2, overflow: 'auto', maxHeight: 400 }}>
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
                              justifyContent: message.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
                              mb: 2
                            }}
                          >
                            <Paper
                              sx={{
                                p: 2,
                                maxWidth: '70%',
                                backgroundColor: message.sender_id === currentUser.id 
                                  ? theme.palette.primary.main 
                                  : theme.palette.grey[100],
                                color: message.sender_id === currentUser.id 
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
                              <MuiIconButton
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                color="primary"
                              >
                                <SendIcon />
                              </MuiIconButton>
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
                    <Typography>Select a chat to start messaging</Typography>
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

export default ChatPage;