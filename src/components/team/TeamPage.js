import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import AttendancePage from '../attendance/AttendancePage';

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

const TeamPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDepartment, setUserDepartment] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          navigate('/');
          return;
        }

        // Get user's department
        const deptResponse = await fetch(`${API_ENDPOINTS.teams.userDepartment(userData.id)}`);
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
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setAttendanceDialogOpen(true);
  };

  const handleCloseAttendanceDialog = () => {
    setAttendanceDialogOpen(false);
    setSelectedMember(null);
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
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            {userDepartment} Team
          </Typography>

          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card 
                  sx={{ 
                    p: 2,
                    cursor: 'default',
                    transition: 'all 0.3s ease',
                    boxShadow: theme.shadows[1],
                    '&:hover': {
                      boxShadow: theme.shadows[1],
                      transform: 'none'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {member.full_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600
                          }}
                        >
                          {member.full_name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            fontFamily: "'Poppins', sans-serif"
                          }}
                        >
                          {member.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`Emp Code: ${member.employee_code}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {member.id === currentUser?.id && (
                        <Chip 
                          label="You"
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                  </CardContent>
            </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={handleCloseAttendanceDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedMember?.full_name} - Attendance Records
        </DialogTitle>
        <DialogContent>
          {selectedMember && (
            <AttendancePage 
              userId={selectedMember.id}
              readOnly={true}
              onClose={handleCloseAttendanceDialog}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAttendanceDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamPage;