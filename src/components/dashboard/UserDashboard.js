import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
// Removed Todo navigation
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import eventService from '../../config/eventService';
import NotificationDropdown from '../common/NotificationDropdown';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      // Simple local logout since we don't have sessions
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      // Continue with local logout even if server logout fails
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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Attendance', icon: <EventAvailableIcon />, path: '/attendance' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    { text: 'Team', icon: <GroupIcon />, path: '/team' }
  ];

  const drawerWidth = 240;

  return (
    <>
      {/* Mobile Drawer */}
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
          <List>
            {menuItems.map((item) => (
              <ListItem
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
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`
          },
      }}
        open
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', overflowX: 'hidden', mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
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
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500
                  } 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    </>
  );
};

const StatCard = ({ title, value, icon, color, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          ...(onClick && {
            backgroundColor: theme.palette.action.hover
          })
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 1, 
              backgroundColor: color + '22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              ml: 2,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const stored = localStorage.getItem('selectedMonth');
    return stored ? parseInt(stored) : new Date().getMonth() + 1;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const stored = localStorage.getItem('selectedYear');
    return stored ? parseInt(stored) : new Date().getFullYear();
  });
  const [stats, setStats] = useState({
    presentDays: 0,
    absentDays: 0,
  });
  const [leaveBalances, setLeaveBalances] = useState({
    pl: 18,
    cl: 7,
    sl: 7
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveHistoryDialog, setLeaveHistoryDialog] = useState({
    open: false,
    leaveType: '',
    title: ''
  });
  const [userDepartment, setUserDepartment] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleLeaveCardClick = async (leaveType) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) return;

      // Fetch leave history for this user
      const response = await fetch(API_ENDPOINTS.users.list);
      if (response.ok) {
        const data = await response.json();
        const user = (data.users || []).find(u => u.id === userData.id);
        
        if (user && user.leave_history) {
          // Filter history for this leave type
          const filteredHistory = user.leave_history
            .filter(record => record.type === leaveType.toLowerCase())
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          setLeaveHistory(filteredHistory);
          
          const leaveTypeNames = {
            'pl': 'Paid Leave',
            'cl': 'Casual Leave', 
            'sl': 'Sick Leave'
          };

          setLeaveHistoryDialog({
            open: true,
            leaveType: leaveType,
            title: `${leaveTypeNames[leaveType.toLowerCase()]} History`
          });
        }
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
      showNotification('Error fetching leave history', 'error');
    }
  };

  const downloadMyAttendance = async () => {
    setDownloading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        showNotification('User data not found. Please log in again.', 'error');
        navigate('/');
        return;
      }

      const params = new URLSearchParams();
      params.append('user_id', userData.id);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      console.log('Fetching attendance data from:', `${API_ENDPOINTS.attendance.list}?${params.toString()}`);
      
      const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const records = data.success && data.records ? data.records : (Array.isArray(data) ? data : []);
        
        if (records.length === 0) {
          showNotification('No attendance data found for the selected period', 'warning');
          setDownloading(false);
          return;
        }
        
        // Convert to Excel-like CSV format
        const excelContent = convertToExcelFormat(records, userData);
        const blob = new Blob([excelContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const monthName = months[selectedMonth - 1];
        a.download = `${userData.full_name.replace(/\s+/g, '_')}_${monthName}_${selectedYear}_Attendance.csv`;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('Attendance data downloaded successfully', 'success');
      } else {
        if (response.status >= 500) {
          // Server error might indicate API health issues
          showNotification(`Server error (${response.status}). Please try again later.`, 'error');
        } else {
          showNotification(`Download failed: ${response.status}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error downloading attendance data:', error);
      showNotification('Error downloading attendance data. Please check your connection.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const convertToExcelFormat = (data, userData) => {
    // Create header rows matching the My Attendance format with department
    let csv = `DCM Infotech\n`;
    csv += `Department Name - ${userData.department || 'General'}\n`;
    csv += `Employee Name,${userData.full_name}\n`;
    csv += `Employee Code,${userData.employee_code || ''}\n`;
    csv += `DATE,DAY,ATTENDANCE,IN-Time,OUT-Time,Total Hours\n`;
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Add data rows with in/out times and total hours
    const diffHours = (inT, outT) => {
      if (!inT || !outT) return '';
      const [ih, im] = inT.split(':').map(Number);
      const [oh, om] = outT.split(':').map(Number);
      if ([ih, im, oh, om].some((n) => isNaN(n))) return '';
      let mins = (oh * 60 + om) - (ih * 60 + im);
      if (mins < 0) mins += 24 * 60;
      const h = String(Math.floor(mins / 60)).padStart(2, '0');
      const m = String(mins % 60).padStart(2, '0');
      return `${h}:${m} hrs`;
    };
    
    sortedData.forEach(record => {
      const date = new Date(record.date);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      const formattedDate = `${date.getDate()}-${months[date.getMonth()].substr(0, 3)}-${date.getFullYear().toString().substr(-2)}`;
      const status = record.status === 'present' ? 'PRESENT' : record.status === 'absent' ? 'ABSENT' : 'OFF';
      const inT = record.in_time || '';
      const outT = record.out_time || '';
      
      csv += `${formattedDate},${dayName},${status},${inT},${outT},${diffHours(inT, outT)}\n`;
    });
    
    return csv;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }

    // Fetch user stats and leave balances
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get attendance stats for current user
        const params = new URLSearchParams();
        params.append('user_id', userData.id);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
        
        console.log('Fetching attendance stats from:', `${API_ENDPOINTS.attendance.stats}?${params.toString()}`);
        
        const response = await fetch(`${API_ENDPOINTS.attendance.stats}?${params.toString()}`, {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          console.error('Failed to fetch stats:', response.status);
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }

        const attendanceData = await response.json();
        console.log('Attendance stats received:', attendanceData);
        
        setStats({
          presentDays: attendanceData.present_days || 0,
          absentDays: attendanceData.absent_days || 0,
        });

        // Fetch leave balances
        const leaveResponse = await fetch(API_ENDPOINTS.leave.balances(userData.id));
        if (leaveResponse.ok) {
          const leaveData = await leaveResponse.json();
          if (leaveData.success) {
            setLeaveBalances(leaveData.balances);
          }
        }

        // Fetch user department
        const deptResponse = await fetch(`${API_ENDPOINTS.teams.userDepartment.replace('{user_id}', userData.id)}`);
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          if (deptData.success) {
            setUserDepartment(deptData.department);
            
            // Fetch team members
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
        console.error('Error fetching stats:', error);
        showNotification(`Error fetching data: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Listen for attendance updates from other components
    const handleStorageChange = (e) => {
      if (e.key === 'attendanceUpdate') {
        fetchStats();
      }
    };

    // Also listen for events from the event service
    const unsubscribe = eventService.listen((eventType, data) => {
      if (eventType === 'attendance_updated' && data.userId === userData.id) {
        console.log('Attendance update detected via event service, refreshing stats');
        fetchStats();
      }
    });

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubscribe();
    };
  }, [navigate, selectedMonth, selectedYear]);

  // In useEffect, after fetching teamMembers, also fetch admin and add to teamMembers if not present
  useEffect(() => {
    const fetchAdmin = async () => {
      const response = await fetch(API_ENDPOINTS.users.list);
      if (response.ok) {
        const data = await response.json();
        const admin = (data.users || []).find(u => u.role === 'admin');
        if (admin && !teamMembers.some(m => m.id === admin.id)) {
          setTeamMembers(prev => [...prev, admin]);
        }
      }
    };
    fetchAdmin();
  }, [teamMembers]);

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
          backgroundColor: theme.palette.grey[50],
          overflow: 'hidden',
          maxWidth: '100vw'
        }}
      >

        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Dashboard Overview
          </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadMyAttendance}
                disabled={downloading}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                {downloading ? 'Downloading...' : 'Download Attendance'}
              </Button>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    localStorage.setItem('selectedMonth', e.target.value);
                  }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    localStorage.setItem('selectedYear', e.target.value);
                  }}
                >
                  {[2024, 2025, 2026].map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Leave Balance Cards */}
            <Grid item xs={12} sm={4} md={4}>
              <StatCard
                title="PL (Paid Leave)"
                value={leaveBalances.pl}
                icon={<EventAvailableIcon sx={{ color: '#FF9800' }} />}
                color="#FF9800"
                onClick={() => handleLeaveCardClick('PL')}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <StatCard
                title="CL (Casual Leave)"
                value={leaveBalances.cl}
                icon={<EventAvailableIcon sx={{ color: '#2196F3' }} />}
                color="#2196F3"
                onClick={() => handleLeaveCardClick('CL')}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <StatCard
                title="SL (Sick Leave)"
                value={leaveBalances.sl}
                icon={<EventAvailableIcon sx={{ color: '#F44336' }} />}
                color="#F44336"
                onClick={() => handleLeaveCardClick('SL')}
              />
            </Grid>

            {/* Attendance Summary Cards */}
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                title={`${months[selectedMonth - 1]} ${selectedYear} - Present`}
                value={stats.presentDays}
                icon={<EventAvailableIcon sx={{ color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <StatCard
                title={`${months[selectedMonth - 1]} ${selectedYear} - Absent`}
                value={stats.absentDays}
                icon={<PersonIcon sx={{ color: theme.palette.error.main }} />}
                color={theme.palette.error.main}
              />
            </Grid>

            {/* Department Information */}
            {userDepartment && (
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 3,
                    mt: 3,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[2]
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    Department: {userDepartment}
                  </Typography>
                  
                  {teamMembers.length > 0 && (
                    <>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mb: 2,
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 500,
                          color: theme.palette.text.secondary
                        }}
                      >
                        Team Members ({teamMembers.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {teamMembers.map((member) => (
                          <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <Card 
                              sx={{ 
                                p: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: theme.shadows[4]
                                }
                              }}
                              onClick={() => navigate(`/team?member=${member.id}`)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PersonIcon sx={{ color: theme.palette.primary.main }} />
                                <Box>
                                  <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                      fontFamily: "'Poppins', sans-serif",
                                      fontWeight: 600
                                    }}
                                  >
                                    {member.full_name}
                                  </Typography>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: theme.palette.text.secondary,
                                      fontFamily: "'Poppins', sans-serif"
                                    }}
                                  >
                                    Emp Code: {member.employee_code}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

             <Snackbar
         open={notification.open}
         autoHideDuration={6000}
         onClose={() => setNotification({ ...notification, open: false })}
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
       >
         <Alert
           onClose={() => setNotification({ ...notification, open: false })}
           severity={notification.severity}
           sx={{ width: '100%' }}
         >
           {notification.message}
         </Alert>
       </Snackbar>

       {/* Leave History Dialog */}
       <Dialog
         open={leaveHistoryDialog.open}
         onClose={() => setLeaveHistoryDialog({ ...leaveHistoryDialog, open: false })}
         maxWidth="md"
         fullWidth
       >
         <DialogTitle>
           <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
             {leaveHistoryDialog.title}
           </Typography>
         </DialogTitle>
         <DialogContent>
           {leaveHistory.length > 0 ? (
             <TableContainer component={Paper} sx={{ mt: 2 }}>
               <Table>
                 <TableHead>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {leaveHistory.map((record, index) => (
                     <TableRow key={index}>
                       <TableCell>
                         {new Date(record.date).toLocaleDateString()}
                       </TableCell>
                       <TableCell>
                         <Chip 
                           label={record.action === 'applied' ? 'Applied' : 'Cancelled'}
                           color={record.action === 'applied' ? 'error' : 'success'}
                           size="small"
                         />
                       </TableCell>
                       <TableCell>
                         {new Date(record.timestamp).toLocaleString()}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           ) : (
             <Box sx={{ textAlign: 'center', py: 4 }}>
               <Typography variant="body1" color="text.secondary">
                 No leave history found for this leave type.
               </Typography>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button 
             onClick={() => setLeaveHistoryDialog({ ...leaveHistoryDialog, open: false })}
             variant="contained"
           >
             Close
           </Button>
         </DialogActions>
       </Dialog>
     </Box>
   );
 };

export default UserDashboard;