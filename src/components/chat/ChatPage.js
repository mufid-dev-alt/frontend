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
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';

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
          sx={{ mr: 2, display: { md: 'none' } }}
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
          Office Attendance Management
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
    { text: 'Team', icon: <GroupIcon />, path: '/team' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
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
        <Box sx={{ overflow: 'hidden' }}>
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
  const [recentChats, setRecentChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [targetEmpCode, setTargetEmpCode] = useState('');
  const [startingChat, setStartingChat] = useState(false);
  const [messageMenuAnchor, setMessageMenuAnchor] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);

  // Team/admin fetch effect
  useEffect(() => {
    let isMounted = true;
    const fetchTeamAndAdmin = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/');
          return;
        }
        // Get department
        const deptResponse = await fetch(`${API_ENDPOINTS.teams.userDepartment(userData.id)}`);
        let members = [];
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          if (deptData.success) {
            setUserDepartment(deptData.department);
            // Get members
            const teamResponse = await fetch(`${API_ENDPOINTS.teams.departmentMembers.replace('{department}', encodeURIComponent(deptData.department))}`);
            if (teamResponse.ok) {
              const teamData = await teamResponse.json();
              if (teamData.success) {
                members = teamData.members;
              }
            }
          }
        }
        // Add admin
        const adminResponse = await fetch(API_ENDPOINTS.users.list);
        if (adminResponse.ok) {
          const data = await adminResponse.json();
          const admin = (data.users || []).find(u => u.role === 'admin');
          if (admin && !members.some(m => m.id === admin.id)) {
            members.push(admin);
          }
        }
        if (isMounted) setTeamMembers(members);
      } catch (error) {
        if (isMounted) setTeamMembers([]);
        console.error('Error fetching chat data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTeamAndAdmin();
    return () => { isMounted = false; };
  }, [navigate]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedChat) {
        fetchMessages();
      }
    }, 3000); // Poll every 3s

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(API_ENDPOINTS.chat.conversations(currentUser.id));
        const data = await res.json();
        if (data.success) {
          // Map to UI list
          const mapped = (data.conversations || []).map(c => ({
            id: c.user.id,
            full_name: c.user.full_name,
            employee_code: c.user.employee_code,
            department: c.user.department,
            last_message: c.last_message,
            timestamp: c.last_timestamp
          }));
          setRecentChats(mapped);
        }
      } catch (e) {
        console.error('Failed to load conversations', e);
      }
    };
    fetchConversations();
  }, [currentUser, messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      let url = `${API_ENDPOINTS.messages.getByUser(currentUser.id)}?chat_type=personal`;
      
      // For personal chats, filter by specific recipient
      if (selectedChat.id) {
        url += `&receiver_id=${selectedChat.id}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Filter messages based on chat type and recipient
          let filteredMessages = data.messages || [];
          
          if (selectedChat.id) {
            // For personal chats, only show messages between current user and selected user
            filteredMessages = filteredMessages.filter(msg => 
              (msg.sender_id === currentUser.id && msg.receiver_id === selectedChat.id) ||
              (msg.sender_id === selectedChat.id && msg.receiver_id === currentUser.id)
            );
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
        receiver_id: selectedChat.id,
        content: newMessage.trim(),
        type: 'personal'
        // Let backend handle timestamp to ensure server time
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

  const openNewChat = () => {
    setTargetEmpCode('');
    setNewChatOpen(true);
  };

  const startChatByEmpCode = async () => {
    const code = parseInt(targetEmpCode, 10);
    if (!code || isNaN(code)) return;
    setStartingChat(true);
    try {
      // 1) Lookup user by employee code
      const lookupRes = await fetch(API_ENDPOINTS.chat.userByEmployeeCode(code));
      const lookup = await lookupRes.json();
      if (!lookup.success || !lookup.user) {
        alert('No user found with that employee code');
        setStartingChat(false);
        return;
      }
      const targetUser = lookup.user;
      if (targetUser.id === currentUser.id) {
        alert('You cannot start a chat with yourself');
        setStartingChat(false);
        return;
      }
      // 2) Open the conversation in UI and fetch messages
      setSelectedChat({ id: targetUser.id, full_name: targetUser.full_name, employee_code: targetUser.employee_code });
      setNewChatOpen(false);
      setTargetEmpCode('');
      // Trigger messages fetch
      setTimeout(fetchMessages, 0);
    } catch (e) {
      console.error('Failed to start chat', e);
      alert('Failed to start chat');
    } finally {
      setStartingChat(false);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const handleChatTypeChange = (event, newValue) => {
    // This function is no longer needed as chat type is removed
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

  // In the render, if loading is false and teamMembers is empty, show a friendly message
  if (!loading && (!teamMembers || teamMembers.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="text.secondary">No team members found. Please contact your admin.</Typography>
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
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <Container maxWidth="xl">
          <Typography 
            variant="h4" 
            sx={{ mb: 3, fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: theme.palette.text.primary }}
          >
            Team Chat
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ ml: 2, borderRadius: 2 }}
              onClick={openNewChat}
            >
              New Chat
            </Button>
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Recent Chats */}
            <Card sx={{ width: { xs: '100%', md: 320 }, mb: { xs: 2, md: 0 }, boxShadow: 3 }}>
              <CardHeader title="Recent Chats" sx={{ pb: 0 }} />
              <Divider />
              <CardContent sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
                <List>
                  {(recentChats && recentChats.length > 0) ? recentChats.map((chat) => (
                    <ListItem
                      key={chat.id}
                      button
                      selected={selectedChat?.id === chat.id}
                      onClick={() => handleChatSelect({ id: chat.id, full_name: chat.full_name, employee_code: chat.employee_code, department: chat.department })}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { backgroundColor: theme.palette.action.hover }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>{(chat.full_name || 'U').charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.full_name || 'Unknown'}
                        secondary={`Emp Code: ${chat.employee_code || ''}${chat.department ? ` | ${chat.department}` : ''}`}
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>{formatTime(chat.timestamp)}</Typography>
                    </ListItem>
                  )) : (
                    <Typography variant="body2" sx={{ p: 2, color: theme.palette.text.secondary }}>
                      No recent chats yet.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
            {/* Team Members */}
            <Card sx={{ width: { xs: '100%', md: 320 }, mb: { xs: 2, md: 0 }, boxShadow: 3 }}>
              <CardHeader title="Team Members" sx={{ pb: 0 }} />
              <Divider />
              <CardContent sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
                <List>
                  {(teamMembers && teamMembers.length > 1) ? teamMembers.filter(member => member.id !== currentUser.id).map((member) => (
                    <ListItem key={member.id} button selected={selectedChat?.id === member.id} onClick={() => handleChatSelect(member)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': { backgroundColor: theme.palette.action.hover }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{member.full_name.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={member.full_name} secondary={`Emp Code: ${member.employee_code}`} />
                    </ListItem>
                  )) : (
                    <Typography variant="body2" sx={{ p: 2, color: theme.palette.text.secondary }}>
                      No team members found.
                    </Typography>
                  )}
                </List>
              </CardContent>
          </Card>
            {/* Chat Messages */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 400, boxShadow: 3 }}>
              <CardHeader 
                title={selectedChat ? selectedChat.name || selectedChat.full_name : 'Select a chat'}
                subheader={selectedChat ? `Emp Code: ${selectedChat.employee_code || ''}` : ''}
              />
              <Divider />
              <CardContent sx={{ flex: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                {selectedChat ? (
                  <>
                    <Box sx={{ flex: 1, p: 2, overflow: 'auto', maxHeight: 350 }}>
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
                                    {message.sender_id === currentUser.id && (
                                      <Tooltip title="Message options">
                                        <MuiIconButton
                                          size="small"
                                          onClick={(e) => handleMessageMenuOpen(e, message)}
                                          sx={{ 
                                            opacity: 0.7,
                                            '&:hover': { opacity: 1 },
                                            color: 'inherit'
                                          }}
                                        >
                                          <MoreVertIcon fontSize="small" />
                                        </MuiIconButton>
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
                        placeholder="Type a message... (Shift+Enter for new line)"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Send message">
                                <MuiIconButton
                                  onClick={sendMessage}
                                  disabled={!newMessage.trim()}
                                  color="primary"
                                >
                                  <SendIcon />
                                </MuiIconButton>
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
                    <Typography>Select a chat to start messaging</Typography>
                  </Box>
                )}
              </CardContent>
          </Card>
          </Box>
    </Container>
      </Box>
    </Box>

    {/* New Chat Modal */}
    <Dialog open={newChatOpen} onClose={() => setNewChatOpen(false)}>
      <DialogTitle>Start New Chat</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Enter Employee Code"
          type="number"
          value={targetEmpCode}
          onChange={(e) => setTargetEmpCode(e.target.value)}
          inputProps={{ min: 1 }}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNewChatOpen(false)}>Cancel</Button>
        <Button onClick={startChatByEmpCode} variant="contained" disabled={startingChat}>
          {startingChat ? 'Starting...' : 'Start Chat'}
        </Button>
      </DialogActions>
    </Dialog>

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

export default ChatPage;