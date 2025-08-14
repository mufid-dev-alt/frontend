import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
// Removed User Todos from admin panel
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import ExcelJS from 'exceljs';
import eventService from '../../config/eventService';

const AdminHeader = ({ onMenuClick }) => {
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
          Admin Dashboard
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
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Attendance Records', icon: <EventAvailableIcon />, path: '/admin/attendance-records' },
    { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/manage-users' }
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
        <Box sx={{ overflow: 'auto' }}>
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
        <Box sx={{ overflow: 'auto', mt: 2 }}>
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

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [userStats, setUserStats] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const stored = localStorage.getItem('adminSelectedMonth');
    return stored ? parseInt(stored) : new Date().getMonth() + 1;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const stored = localStorage.getItem('adminSelectedYear');
    return stored ? parseInt(stored) : new Date().getFullYear();
  });
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const showNotification = useCallback((message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching users from:', API_ENDPOINTS.users.list);
      const response = await fetch(API_ENDPOINTS.users.list, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, redirect to login
          localStorage.removeItem('user');
          navigate('/');
          return [];
        }
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data received:', data);
      
      // Handle the backend response structure {success: true, users: [...]}
      const usersArray = data.success && data.users ? data.users : (Array.isArray(data) ? data : []);
      
      // Filter out admin users if needed
      const usersList = usersArray.filter(user => user.role !== 'admin');
      setUsers(usersList);
      return usersList;
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification(`Error fetching users: ${error.message}`, 'error');
      return [];
    }
  }, [navigate, showNotification]);

  const fetchUserStats = useCallback(async (usersList) => {
    setLoading(true);
    try {
      const usersToProcess = usersList || users;
      if (!usersToProcess.length) {
        setLoading(false);
        return;
      }

      const statsPromises = usersToProcess.map(async (user) => {
        const params = new URLSearchParams();
        params.append('user_id', user.id);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
        
        console.log('Fetching stats for user:', user.id, 'from:', `${API_ENDPOINTS.attendance.stats}?${params.toString()}`);
        
        try {
          const response = await fetch(`${API_ENDPOINTS.attendance.stats}?${params.toString()}`, {
            headers: { 'Accept': 'application/json' }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              // Handle auth error
              throw new Error('Authentication failed');
            }
            throw new Error(`Server responded with ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Stats received for user:', user.id, data);
          return { userId: user.id, stats: data };
        } catch (error) {
          console.error(`Error fetching stats for user ${user.id}:`, error);
          return { userId: user.id, stats: { present_days: 0, absent_days: 0, total_days: 0 } };
        }
      });

      const results = await Promise.all(statsPromises);
      const statsMap = {};
      results.forEach(result => {
        statsMap[result.userId] = result.stats;
      });

      setUserStats(statsMap);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      showNotification(`Error fetching attendance data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [users, selectedMonth, selectedYear, showNotification]);

  const exportUserData = async (userId, userName) => {
    try {
      const params = new URLSearchParams();
      params.append('user_id', userId);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      console.log('Exporting attendance for user:', userId, 'from:', `${API_ENDPOINTS.attendance.list}?${params.toString()}`);
      
      const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Export data received:', data);
      const records = data.success && data.records ? data.records : (Array.isArray(data) ? data : []);
      
      console.log('Processed records:', records);
      
      if (records.length === 0) {
        showNotification(`No attendance data found for ${userName}`, 'warning');
        return;
      }

      // Find the user object
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Build formatted Excel workbook
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Attendance');
      const monthName = months[selectedMonth - 1];
      ws.mergeCells('A1:F1');
      ws.getCell('A1').value = 'DCM Infotech';
      ws.getCell('A1').alignment = { horizontal: 'center' };
      ws.getCell('A1').font = { bold: true };
      ws.mergeCells('A2:F2');
      ws.getCell('A2').value = 'Department Name - Telecom Service Department';
      ws.getCell('A3').value = 'Employee Name';
      ws.getCell('B3').value = user.full_name;
      ws.getCell('A4').value = 'Employee Code';
      ws.getCell('B4').value = user.employee_code || '';
      const headerRowIndex = 5;
      ws.getRow(headerRowIndex).values = ['DATE', 'DAY', 'ATTENDANCE', 'IN-Time', 'OUT-Time', 'Total Hours'];
      ws.getRow(headerRowIndex).font = { bold: true };
      const diff = (inT, outT) => {
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
      const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
      let rowPtr = headerRowIndex + 1;
      sorted.forEach((r) => {
        const d = new Date(r.date);
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
        const formattedDate = `${d.getDate()}-${months[d.getMonth()].substr(0, 3)}-${d.getFullYear().toString().substr(-2)}`;
        const status = r.status === 'present' ? 'PRESENT' : r.status === 'absent' ? 'ABSENT' : 'OFF';
        const inT = r.in_time || '';
        const outT = r.out_time || '';
        ws.getRow(rowPtr).values = [formattedDate, dayName, status, inT, outT, diff(inT, outT)];
        rowPtr += 1;
      });
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });
      ws.columns = [ { width: 14 }, { width: 14 }, { width: 14 }, { width: 12 }, { width: 12 }, { width: 14 } ];
      const blob = await wb.xlsx.writeBuffer();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.full_name.replace(/\s+/g, '_')}_${monthName}_${selectedYear}_Attendance.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification(`Attendance data for ${userName} downloaded successfully`, 'success');
    } catch (error) {
      console.error('Error exporting user data:', error);
      showNotification(`Error exporting data: ${error.message}`, 'error');
    }
  };

  const exportAllUsers = async () => {
    try {
      const usersList = users;
      if (!usersList.length) {
        showNotification('No users to export', 'warning');
        return;
      }
      const rows = ['EMPLOYEE_CODE,NAME,EMAIL,DATE,DAY,ATTENDANCE,IN_TIME,OUT_TIME'];
      for (const user of usersList) {
        const params = new URLSearchParams();
        params.append('user_id', user.id);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
        const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) continue;
        const data = await response.json();
        const records = data.success && data.records ? data.records : [];
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        sorted.forEach(r => {
          const d = new Date(r.date);
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
          const formattedDate = `${d.getDate()}-${months[d.getMonth()].substr(0, 3)}-${d.getFullYear().toString().substr(-2)}`;
          const status = r.status === 'present' ? 'PRESENT' : r.status === 'absent' ? 'ABSENT' : 'OFF';
          rows.push(`${user.employee_code || ''},${user.full_name.replace(/,/g, ' ')},${user.email},${formattedDate},${dayName},${status},${r.in_time || ''},${r.out_time || ''}`);
        });
      }
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const monthName = months[selectedMonth - 1];
      a.download = `All_Users_${monthName}_${selectedYear}_Attendance.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification('All users attendance exported', 'success');
    } catch (error) {
      console.error('Error exporting all users:', error);
      showNotification('Error exporting all users', 'error');
    }
  };

  const handleAuthError = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const convertToExcelFormat = (data, userData) => {
    // New format per sample: headers + in/out + total hours
    const header = [
      'DCM Infotech',
      '',
      '',
    ].join(',');
    let csv = `${header}\n`;
    csv += `Department Name - Telecom Service Department\n`;
    csv += `Employee Name,${userData.full_name}\n`;
    csv += `Employee Code,${userData.employee_code || ''}\n`;
    csv += `DATE,DAY,ATTENDANCE,IN-Time,OUT-Time,Total Hours\n`;
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const toHM = (t) => t || '';
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
    sorted.forEach((r) => {
      const d = new Date(r.date);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
      const formattedDate = `${d.getDate()}-${months[d.getMonth()].substr(0, 3)}-${d.getFullYear().toString().substr(-2)}`;
      const status = r.status === 'present' ? 'PRESENT' : r.status === 'absent' ? 'ABSENT' : 'OFF';
      const inT = toHM(r.in_time);
      const outT = toHM(r.out_time);
      csv += `${formattedDate},${dayName},${status},${inT},${outT},${diffHours(inT, outT)}\n`;
    });
    return csv;
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getAttendanceRate = (userId) => {
    const stats = userStats[userId];
    if (!stats) return 0;
    
    const totalDays = stats.total_days || (stats.present_days + stats.absent_days);
    if (totalDays === 0) return 0;
    
    return Math.round((stats.present_days / totalDays) * 100);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadData = async () => {
      const usersList = await fetchUsers();
      await fetchUserStats(usersList);
    };

    loadData();
    
    // Listen for user updates from other components
    const unsubscribe = eventService.listen((eventType, data) => {
      if (['user_added', 'user_deleted', 'user_updated'].includes(eventType)) {
        console.log(`${eventType} event detected, refreshing users`);
        loadData();
      } else if (eventType === 'attendance_updated') {
        console.log('Attendance update detected, refreshing stats');
        fetchUserStats();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, selectedMonth, selectedYear]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const usersList = await fetchUsers();
      await fetchUserStats(usersList);
      showNotification('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showNotification('Error refreshing data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
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
          backgroundColor: theme.palette.grey[50]
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
              Employee Attendance Overview
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                InputProps={{ startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ) }}
              />
              <TextField
                size="small"
                placeholder="Search by employee code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                InputProps={{ startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ) }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    localStorage.setItem('adminSelectedMonth', e.target.value);
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
                    localStorage.setItem('adminSelectedYear', e.target.value);
                  }}
                >
                  {[2024, 2025, 2026].map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ height: 40 }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={exportAllUsers}
                disabled={loading}
                sx={{ height: 40 }}
              >
                Export All Users
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No employees found</Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>Emp Code</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Present</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Absent</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Total Days</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => (searchName ? u.full_name.toLowerCase().includes(searchName.toLowerCase()) : true))
                      .filter(u => (searchCode ? String(u.employee_code || '').includes(searchCode) : true))
                      .map(user => {
                        const stats = userStats[user.id] || { present_days: 0, absent_days: 0, total_days: 0 };
                        const totalDays = stats.total_days || (stats.present_days + stats.absent_days);
                        return (
                          <tr key={user.id}>
                            <td style={{ padding: 8 }}>{user.employee_code || ''}</td>
                            <td style={{ padding: 8 }}>{user.full_name}</td>
                            <td style={{ padding: 8 }}>{user.email}</td>
                            <td style={{ padding: 8 }}>{stats.present_days || 0}</td>
                            <td style={{ padding: 8 }}>{stats.absent_days || 0}</td>
                            <td style={{ padding: 8 }}>{totalDays || 0}</td>
                            <td style={{ padding: 8 }}>
                              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportUserData(user.id, user.full_name)}>
                                Export
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </Box>
            </Paper>
          )}
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
    </Box>
  );
};

export default AdminDashboard;