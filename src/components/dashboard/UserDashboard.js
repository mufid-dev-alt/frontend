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
  Chip,
  TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
// Removed Todo navigation
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import eventService from '../../config/eventService';
import NotificationDropdown from '../common/NotificationDropdown';
import ExcelJS from 'exceljs';

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
    { text: 'Team', icon: <GroupIcon />, path: '/team' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
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
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);

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

  const handleGoToDate = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        showNotification('User data not found. Please log in again.', 'error');
        navigate('/');
        return;
      }

      const selectedDate = new Date(testDate);
      const currentYear = selectedDate.getFullYear();

      // First check if the response has content before parsing JSON
      const response = await fetch(`${API_ENDPOINTS.leave.rollover}/${currentYear}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const responseText = await response.text();
        
        // Check if response has content
        if (!responseText || responseText.trim() === '') {
          showNotification('Year-end rollover processed successfully!', 'success');
          fetchStats(); // Refresh leave balances
          return;
        }

        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            showNotification(`Year-end rollover processed for ${currentYear}. New leave balances applied.`, 'success');
            fetchStats(); // Refresh leave balances
          } else {
            showNotification(`Rollover failed: ${data.message}`, 'error');
          }
        } catch (jsonError) {
          // If JSON parsing fails, but response was ok, assume success
          showNotification('Year-end rollover processed successfully!', 'success');
          fetchStats(); // Refresh leave balances
        }
      } else {
        showNotification('Failed to process year-end rollover', 'error');
      }
    } catch (error) {
      console.error('Error processing year-end rollover:', error);
      showNotification('Error processing year-end rollover', 'error');
    }
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
      params.append('employee_code', userData.employee_code);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
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
        
        // Build formatted Excel workbook
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Attendance');
        
        // Set font size to 7 for all cells
        const fontSize = 7;
        
        const monthName = months[selectedMonth - 1];
        const year = selectedYear;
        
        // Calculate date range
        const startDate = new Date(year, selectedMonth - 1, 1);
        const endDate = new Date(year, selectedMonth, 0);
        const dateRange = `${monthName}-1-${year} to ${monthName}-${endDate.getDate()}-${year}`;
        
        // Create header rows matching the exact format
        ws.mergeCells('A1:AF1');
        ws.getRow(1).getCell('A').value = 'Monthly Status Report (Basic Work Duration)';
        ws.getRow(1).getCell('A').alignment = { horizontal: 'center' };
        ws.getRow(1).getCell('A').font = { bold: true, size: fontSize };
        
        ws.mergeCells('A2:AF2');
        ws.getRow(2).getCell('A').value = dateRange;
        ws.getRow(2).getCell('A').alignment = { horizontal: 'center' };
        ws.getRow(2).getCell('A').font = { size: fontSize };
        
        ws.mergeCells('A3:AF3');
        ws.getRow(3).getCell('A').value = 'COMPANY : DCM INFOTECH LIMITED';
        ws.getRow(3).getCell('A').font = { size: fontSize };
        
        ws.mergeCells('A4:AF4');
        ws.getRow(4).getCell('A').value = `DEPARTMENT NAME : ${userData.department || 'General'}`;
        ws.getRow(4).getCell('A').font = { bold: true, size: fontSize };
        
        // User info rows
        ws.getRow(5).getCell('A').value = 'Emp. Code :';
        ws.getRow(5).getCell('A').font = { size: fontSize };
        ws.getRow(5).getCell('B').value = userData.employee_code || '';
        ws.getRow(5).getCell('B').font = { size: fontSize };
        
        ws.getRow(6).getCell('A').value = 'Emp. Name :';
        ws.getRow(6).getCell('A').font = { size: fontSize };
        ws.getRow(6).getCell('B').value = userData.full_name;
        ws.getRow(6).getCell('B').font = { size: fontSize };
        
        const headerRowIndex = 8;
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Days header row
        ws.getRow(headerRowIndex).getCell('A').value = 'Days';
        ws.getRow(headerRowIndex).getCell('A').font = { bold: true, size: fontSize };
        
        // Add day columns (1 T, 2 W, 3 Th, etc.)
        const dayAbbr = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
        let colIndex = 1; // Start from column B
        
        // Helper function to convert number to column letter
        const getColumnLetter = (index) => {
          let letter = '';
          while (index > 0) {
            let remainder = (index - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            index = Math.floor((index - 1) / 26);
          }
          return letter;
        };
        
        for (let day = 1; day <= endDate.getDate(); day++) {
          const date = new Date(year, selectedMonth - 1, day);
          const dayOfWeek = date.getDay();
          const colLetter = getColumnLetter(colIndex + 1);
          
          ws.getRow(headerRowIndex).getCell(colLetter).value = `${day} ${dayAbbr[dayOfWeek]}`;
          ws.getRow(headerRowIndex).getCell(colLetter).font = { bold: true, size: fontSize };
          colIndex++;
        }
        
        // Attendance data row
        let currentRow = headerRowIndex + 1;
        colIndex = 0;
        
        for (let day = 1; day <= endDate.getDate(); day++) {
          const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = sorted.find(r => r.date === dateStr);
          const colLetter = getColumnLetter(colIndex + 1);
          
          if (record) {
            let statusValue = 'A';
            if (record.status === 'present') {
              statusValue = 'P';
            } else if (record.status.toUpperCase() === 'PL') {
              statusValue = 'PL';
            } else if (record.status.toUpperCase() === 'CL') {
              statusValue = 'CL';
            } else if (record.status.toUpperCase() === 'SL') {
              statusValue = 'SL';
            }
            ws.getRow(currentRow).getCell(colLetter).value = statusValue;
          } else {
            ws.getRow(currentRow).getCell(colLetter).value = 'A';
          }
          ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
          colIndex++;
        }
        currentRow++;
        
        // Summary section
        currentRow += 2;
        
        ws.mergeCells(`A${currentRow}:AF${currentRow}`);
        ws.getRow(currentRow).getCell('A').value = 'SUMMARY';
        ws.getRow(currentRow).getCell('A').font = { bold: true, size: fontSize };
        ws.getRow(currentRow).getCell('A').alignment = { horizontal: 'center' };
        currentRow++;
        
        // Count statistics
        const presentDays = sorted.filter(r => r.status === 'present').length;
        const absentDays = sorted.filter(r => r.status === 'absent').length;
        const plDays = sorted.filter(r => r.status.toUpperCase() === 'PL').length;
        const clDays = sorted.filter(r => r.status.toUpperCase() === 'CL').length;
        const slDays = sorted.filter(r => r.status.toUpperCase() === 'SL').length;
        const totalDays = endDate.getDate();
        
        const summaryData = [
          ['Total Days', totalDays],
          ['Present Days', presentDays],
          ['Absent Days', absentDays],
          ['PL Days', plDays],
          ['CL Days', clDays],
          ['SL Days', slDays]
        ];
        
        summaryData.forEach(([label, value]) => {
          ws.getRow(currentRow).getCell('A').value = label;
          ws.getRow(currentRow).getCell('A').font = { size: fontSize };
          ws.getRow(currentRow).getCell('B').value = value;
          ws.getRow(currentRow).getCell('B').font = { size: fontSize };
          currentRow++;
        });
        
        // Set column widths
        ws.getColumn('A').width = 12;
        for (let i = 2; i <= 32; i++) {
          ws.getColumn(i).width = 4;
        }
        
        // Generate Excel file
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userData.full_name.replace(/\s+/g, '_')}_${monthName}_${year}_Attendance.xlsx`;
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

  // Fetch user stats and leave balances
  const fetchStats = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      // Get attendance stats for current user
      const params = new URLSearchParams();
      params.append('employee_code', userData.employee_code);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      const response = await fetch(`${API_ENDPOINTS.attendance.stats}?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const attendanceData = await response.json();

      setStats({
        presentDays: attendanceData.present_days || 0,
        absentDays: attendanceData.absent_days || 0,
      });

      // Fetch leave balances
      try {
        const leaveResponse = await fetch(API_ENDPOINTS.leave.balances(userData.employee_code));
        if (leaveResponse.ok) {
          const leaveData = await leaveResponse.json();
          
          if (leaveData.success) {
            setLeaveBalances(leaveData.balances);
          }
        }
      } catch (error) {
        console.error('Error fetching leave balances:', error);
      }

      // Fetch user department
      try {
        const deptResponse = await fetch(`${API_ENDPOINTS.teams.userDepartment.replace('{user_id}', userData.id)}`);
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          if (deptData.success) {
            setUserDepartment(deptData.department);
            
            // Fetch team members
            try {
              const teamResponse = await fetch(`${API_ENDPOINTS.teams.departmentMembers.replace('{department}', encodeURIComponent(deptData.department))}`);
              if (teamResponse.ok) {
                const teamData = await teamResponse.json();
                if (teamData.success) {
                  setTeamMembers(teamData.members);
                }
              }
            } catch (error) {
              
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user department:', error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      showNotification(`Error fetching data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }

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
      try {
        const response = await fetch(API_ENDPOINTS.users.list);
        if (response.ok) {
          const data = await response.json();
          const admin = (data.users || []).find(u => u.role === 'admin');
          if (admin && !teamMembers.some(m => m.id === admin.id)) {
            setTeamMembers(prev => [...prev, admin]);
          }
        }
      } catch (error) {
        
      }
    };
    fetchAdmin();
  }, [teamMembers.length]); // Only depend on length to prevent infinite loop

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

            {/* Go to Date Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Test Year-End Rollover
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <TextField
                    type="date"
                    label="Go to Date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    size="small"
                    sx={{ minWidth: 200 }}
                  />
                    <Button
                      variant="contained"
                    onClick={handleGoToDate}
                      sx={{ 
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45a049' }
                      }}
                    >
                    Go to Date
                    </Button>
                </Box>
                  
              </Paper>
            </Grid>

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