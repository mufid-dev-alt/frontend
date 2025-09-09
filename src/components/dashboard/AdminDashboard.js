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
  InputAdornment,
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
// Removed Todos
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
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
      // Local logout
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      // Continue logout
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
    { text: 'Manage Users', icon: <PersonIcon />, path: '/admin/manage-users' },
    { text: 'Chat', icon: <ChatIcon />, path: '/admin/chat' }
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
  const [userLeaveBalances, setUserLeaveBalances] = useState({});
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
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper function to convert column index to Excel column letter
  const getColumnLetter = (index) => {
    let result = '';
    while (index > 0) {
      index--;
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26);
    }
    return result;
  };

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
        params.append('employee_code', user.employee_code);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
        
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
          
          return { employeeCode: user.employee_code, stats: data };
        } catch (error) {
          console.error(`Error fetching stats for user ${user.id}:`, error);
          return { employeeCode: user.employee_code, stats: { present_days: 0, absent_days: 0, total_days: 0 } };
        }
      });

      const results = await Promise.all(statsPromises);
      const statsMap = {};
      results.forEach(result => {
        statsMap[result.employeeCode] = result.stats;
      });

      setUserStats(statsMap);

      // Fetch leave balances for all users
      const leavePromises = usersToProcess.map(async (user) => {
        try {
          const response = await fetch(API_ENDPOINTS.leave.balances(user.employee_code));
          if (response.ok) {
            const data = await response.json();
            return { employeeCode: user.employee_code, balances: data.success ? data.balances : { pl: 18, cl: 7, sl: 7 } };
          }
          return { employeeCode: user.employee_code, balances: { pl: 18, cl: 7, sl: 7 } };
        } catch (error) {
          console.error(`Error fetching leave balances for user ${user.employee_code}:`, error);
          return { employeeCode: user.employee_code, balances: { pl: 18, cl: 7, sl: 7 } };
        }
      });

      const leaveResults = await Promise.all(leavePromises);
      const leaveMap = {};
      leaveResults.forEach(result => {
        leaveMap[result.employeeCode] = result.balances;
      });

      setUserLeaveBalances(leaveMap);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      showNotification(`Error fetching attendance data: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [users, selectedMonth, selectedYear, showNotification]);

  const exportUserData = async (employeeCode, userName) => {
    try {
      const params = new URLSearchParams();
      params.append('employee_code', employeeCode);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
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
      
      const records = data.success && data.records ? data.records : (Array.isArray(data) ? data : []);
      
      if (records.length === 0) {
        showNotification(`No attendance data found for ${userName}`, 'warning');
        return;
      }

      // Find the user object
      const user = users.find(u => u.employee_code === employeeCode);
      if (!user) {
        throw new Error('User not found');
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
      ws.getRow(4).getCell('A').value = `DEPARTMENT NAME : ${user.department || 'General'}`;
      ws.getRow(4).getCell('A').font = { bold: true, size: fontSize };
      
      // User info rows
      ws.getRow(5).getCell('A').value = 'Emp. Code :';
      ws.getRow(5).getCell('A').font = { size: fontSize };
      ws.getRow(5).getCell('B').value = user.employee_code || '';
      ws.getRow(5).getCell('B').font = { size: fontSize };
      
      ws.getRow(6).getCell('A').value = 'Emp. Name :';
      ws.getRow(6).getCell('A').font = { size: fontSize };
      ws.getRow(6).getCell('B').value = user.full_name;
      ws.getRow(6).getCell('B').font = { size: fontSize };
      
      const headerRowIndex = 8;
      const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Days header row
      ws.getRow(headerRowIndex).getCell('A').value = 'Days';
      ws.getRow(headerRowIndex).getCell('A').font = { bold: true, size: fontSize };
      
      // Add day columns (1 T, 2 W, 3 Th, etc.)
      let colIndex = 1; // Start from B column
      for (let day = 1; day <= endDate.getDate(); day++) {
        const date = new Date(year, selectedMonth - 1, day);
        const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'St'];
        const dayName = dayNames[date.getDay()];
        const colLetter = getColumnLetter(colIndex + 1); // +1 because A=1, B=2, etc.
        
        ws.getRow(headerRowIndex).getCell(colLetter).value = `${day} ${dayName}`;
        ws.getRow(headerRowIndex).getCell(colLetter).font = { bold: true, size: fontSize };
        colIndex++;
      }
      
      // Status row
      let currentRow = headerRowIndex + 1;
      ws.getRow(currentRow).getCell('A').value = 'Status';
      ws.getRow(currentRow).getCell('A').font = { size: fontSize };
      
      colIndex = 1;
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
      
      // InTime row
      ws.getRow(currentRow).getCell('A').value = 'InTime';
      ws.getRow(currentRow).getCell('A').font = { size: fontSize };
      
      colIndex = 1;
      for (let day = 1; day <= endDate.getDate(); day++) {
        const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = sorted.find(r => r.date === dateStr);
        const colLetter = getColumnLetter(colIndex + 1);
        
        if (record && record.in_time) {
          ws.getRow(currentRow).getCell(colLetter).value = record.in_time;
        }
        ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
        colIndex++;
      }
      currentRow++;
      
      // OutTime row
      ws.getRow(currentRow).getCell('A').value = 'OutTime';
      ws.getRow(currentRow).getCell('A').font = { size: fontSize };
      
      colIndex = 1;
      for (let day = 1; day <= endDate.getDate(); day++) {
        const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = sorted.find(r => r.date === dateStr);
        const colLetter = getColumnLetter(colIndex + 1);
        
        if (record && record.out_time) {
          ws.getRow(currentRow).getCell(colLetter).value = record.out_time;
        }
        ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
        colIndex++;
      }
      currentRow++;
      
      // Total row
      ws.getRow(currentRow).getCell('A').value = 'Total';
      ws.getRow(currentRow).getCell('A').font = { size: fontSize };
      
      colIndex = 1;
      for (let day = 1; day <= endDate.getDate(); day++) {
        const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = sorted.find(r => r.date === dateStr);
        const colLetter = getColumnLetter(colIndex + 1);
        
        if (record && record.in_time && record.out_time) {
          // Calculate total hours
          const [ih, im] = record.in_time.split(':').map(Number);
          const [oh, om] = record.out_time.split(':').map(Number);
          if (!isNaN(ih) && !isNaN(im) && !isNaN(oh) && !isNaN(om)) {
        let mins = (oh * 60 + om) - (ih * 60 + im);
        if (mins < 0) mins += 24 * 60;
        const h = String(Math.floor(mins / 60)).padStart(2, '0');
        const m = String(mins % 60).padStart(2, '0');
            ws.getRow(currentRow).getCell(colLetter).value = `${h}:${m}`;
          } else {
            ws.getRow(currentRow).getCell(colLetter).value = '00:00';
          }
        } else {
          ws.getRow(currentRow).getCell(colLetter).value = '00:00';
        }
        ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
        colIndex++;
      }
      
      // Apply borders to all cells
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = { 
            top: { style: 'thin' }, 
            left: { style: 'thin' }, 
            bottom: { style: 'thin' }, 
            right: { style: 'thin' } 
          };
        });
      });
      
      // Set column widths
      ws.getColumn('A').width = 12;
      for (let i = 1; i <= endDate.getDate(); i++) {
        const colLetter = getColumnLetter(i + 1);
        ws.getColumn(colLetter).width = 8;
      }
      
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

      // Create Excel workbook
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('All Users Attendance');
      
      // Set font size to 7 for all cells
      const fontSize = 7;
      
      // Get month name and year
      const monthName = months[selectedMonth - 1];
      const year = selectedYear;
      
      // Calculate date range
      const startDate = new Date(year, selectedMonth - 1, 1);
      const endDate = new Date(year, selectedMonth, 0);
      const dateRange = `${monthName}-1-${year} to ${monthName}-${endDate.getDate()}-${year}`;
      
      // Create header rows
      ws.mergeCells('A1:AF1');
      ws.getCell('A1').value = 'Monthly Status Report (Basic Work Duration)';
      ws.getCell('A1').alignment = { horizontal: 'center' };
      ws.getCell('A1').font = { bold: true, size: fontSize };
      
      ws.mergeCells('A2:AF2');
      ws.getCell('A2').value = dateRange;
      ws.getCell('A2').alignment = { horizontal: 'center' };
      ws.getCell('A2').font = { size: fontSize };
      
      ws.mergeCells('A3:AF3');
      ws.getCell('A3').value = 'COMPANY : DCM INFOTECH LIMITED';
      ws.getCell('A3').font = { size: fontSize };
      
      // Group users by department
      const departmentGroups = {};
      usersList.forEach(user => {
        if (!departmentGroups[user.department]) {
          departmentGroups[user.department] = [];
        }
        departmentGroups[user.department].push(user);
      });
      
      let currentRow = 5;
      
      // Process each department
      for (const [departmentName, departmentUsers] of Object.entries(departmentGroups)) {
                 // Department header
         ws.mergeCells(`A${currentRow}:AF${currentRow}`);
         ws.getRow(currentRow).getCell('A').value = `DEPARTMENT NAME : ${departmentName}`;
         ws.getRow(currentRow).getCell('A').font = { bold: true, size: fontSize };
         currentRow++;
         
         // Process each user in the department
         for (const user of departmentUsers) {
           // User info rows
           ws.getRow(currentRow).getCell('A').value = 'Emp. Code :';
           ws.getRow(currentRow).getCell('A').font = { size: fontSize };
           ws.getRow(currentRow).getCell('B').value = user.employee_code || '';
           ws.getRow(currentRow).getCell('B').font = { size: fontSize };
           currentRow++;
           
           ws.getRow(currentRow).getCell('A').value = 'Emp. Name :';
           ws.getRow(currentRow).getCell('A').font = { size: fontSize };
           ws.getRow(currentRow).getCell('B').value = user.full_name;
           ws.getRow(currentRow).getCell('B').font = { size: fontSize };
           currentRow++;
          
          // Get attendance data for this user
        const params = new URLSearchParams();
        params.append('employee_code', user.employee_code);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
          
        const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
          headers: { 'Accept': 'application/json' }
        });
          
          if (response.ok) {
        const data = await response.json();
        const records = data.success && data.records ? data.records : [];
            
            if (records.length > 0) {
              // Create attendance table for this user
              const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
              
              // Days header row
              ws.getRow(currentRow).getCell('A').value = 'Days';
              ws.getRow(currentRow).getCell('A').font = { bold: true, size: fontSize };
              
              // Add day columns (1 T, 2 W, 3 Th, etc.)
              let colIndex = 1; // Start from B column
              for (let day = 1; day <= endDate.getDate(); day++) {
                const date = new Date(year, selectedMonth - 1, day);
                const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'St'];
                const dayName = dayNames[date.getDay()];
                const colLetter = getColumnLetter(colIndex + 1);
                
                ws.getRow(currentRow).getCell(colLetter).value = `${day} ${dayName}`;
                ws.getRow(currentRow).getCell(colLetter).font = { bold: true, size: fontSize };
                colIndex++;
              }
              currentRow++;
              
              // Status row
              ws.getRow(currentRow).getCell('A').value = 'Status';
              ws.getRow(currentRow).getCell('A').font = { size: fontSize };
              
              colIndex = 1;
              for (let day = 1; day <= endDate.getDate(); day++) {
                const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = sortedRecords.find(r => r.date === dateStr);
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
              
              // InTime row
              ws.getRow(currentRow).getCell('A').value = 'InTime';
              ws.getRow(currentRow).getCell('A').font = { size: fontSize };
              
              colIndex = 1;
              for (let day = 1; day <= endDate.getDate(); day++) {
                const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = sortedRecords.find(r => r.date === dateStr);
                const colLetter = getColumnLetter(colIndex + 1);
                
                if (record && record.in_time) {
                  ws.getRow(currentRow).getCell(colLetter).value = record.in_time;
                }
                ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
                colIndex++;
              }
              currentRow++;
              
              // OutTime row
              ws.getRow(currentRow).getCell('A').value = 'OutTime';
              ws.getRow(currentRow).getCell('A').font = { size: fontSize };
              
              colIndex = 1;
              for (let day = 1; day <= endDate.getDate(); day++) {
                const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = sortedRecords.find(r => r.date === dateStr);
                const colLetter = getColumnLetter(colIndex + 1);
                
                if (record && record.out_time) {
                  ws.getRow(currentRow).getCell(colLetter).value = record.out_time;
                }
                ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
                colIndex++;
              }
              currentRow++;
              
              // Total row
              ws.getRow(currentRow).getCell('A').value = 'Total';
              ws.getRow(currentRow).getCell('A').font = { size: fontSize };
              
              colIndex = 1;
              for (let day = 1; day <= endDate.getDate(); day++) {
                const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const record = sortedRecords.find(r => r.date === dateStr);
                const colLetter = getColumnLetter(colIndex + 1);
                
                if (record && record.in_time && record.out_time) {
                  // Calculate total hours
                  const [ih, im] = record.in_time.split(':').map(Number);
                  const [oh, om] = record.out_time.split(':').map(Number);
                  if (!isNaN(ih) && !isNaN(im) && !isNaN(oh) && !isNaN(om)) {
                    let mins = (oh * 60 + om) - (ih * 60 + im);
                    if (mins < 0) mins += 24 * 60;
                    const h = String(Math.floor(mins / 60)).padStart(2, '0');
                    const m = String(mins % 60).padStart(2, '0');
                    ws.getRow(currentRow).getCell(colLetter).value = `${h}:${m}`;
                  } else {
                    ws.getRow(currentRow).getCell(colLetter).value = '00:00';
                  }
                } else {
                  ws.getRow(currentRow).getCell(colLetter).value = '00:00';
                }
                ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
                colIndex++;
              }
              currentRow++;
            }
          }
          
          // Add some spacing between users
          currentRow += 2;
        }
        
        // Add spacing between departments
        currentRow += 2;
      }
      
      // Apply borders to all cells
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = { 
            top: { style: 'thin' }, 
            left: { style: 'thin' }, 
            bottom: { style: 'thin' }, 
            right: { style: 'thin' } 
          };
        });
      });
      
      // Set column widths
      ws.getColumn('A').width = 12;
      for (let i = 1; i <= endDate.getDate(); i++) {
        const colLetter = getColumnLetter(i + 1);
        ws.getColumn(colLetter).width = 8;
      }
      
      const blob = await wb.xlsx.writeBuffer();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `All_Users_${monthName}_${selectedYear}_Attendance.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification('All users attendance exported successfully', 'success');
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
    csv += `Department Name - ${userData.department || 'General'}\n`;
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

  const getDepartmentIcon = (departmentName) => {
    if (departmentName.includes('Technical')) return <BusinessIcon />;
    if (departmentName.includes('HR')) return <GroupsIcon />;
    if (departmentName.includes('Account')) return <AccountBalanceIcon />;
    if (departmentName.includes('Telecom')) return <PhoneIcon />;
    return <GroupsIcon />;
  };

  const fetchDepartments = useCallback(async () => {
    try {
      // Extract unique departments from users
      const departmentGroups = {};
      users.forEach(user => {
        if (user.department) {
          if (!departmentGroups[user.department]) {
            departmentGroups[user.department] = [];
          }
          departmentGroups[user.department].push(user);
        }
      });
      
      const deptList = Object.keys(departmentGroups).map(dept => ({
        name: dept,
        memberCount: departmentGroups[dept].length,
        members: departmentGroups[dept]
      }));
      
      setDepartments(deptList);
    } catch (error) {
      console.error('Error organizing departments:', error);
    }
  }, [users]);

  const handleDepartmentClick = async (department) => {
    setSelectedDepartment(department);
    setDepartmentMembers(department.members);
    setDepartmentDialogOpen(true);
  };

  const exportDepartmentData = async (department) => {
    try {
      if (!department || !department.members || department.members.length === 0) {
        showNotification('No users in this department to export', 'warning');
        return;
      }

      // Create Excel workbook
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(`${department.name} Attendance`);
      
      // Set font size to 7 for all cells
      const fontSize = 7;
      
      // Get month name and year
      const monthName = months[selectedMonth - 1];
      const year = selectedYear;
      
      // Calculate date range
      const startDate = new Date(year, selectedMonth - 1, 1);
      const endDate = new Date(year, selectedMonth, 0);
      const dateRange = `${monthName}-1-${year} to ${monthName}-${endDate.getDate()}-${year}`;
      
      // Create header rows
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
      
      // Department header
      ws.mergeCells('A4:AF4');
      ws.getRow(4).getCell('A').value = `DEPARTMENT NAME : ${department.name}`;
      ws.getRow(4).getCell('A').font = { bold: true, size: fontSize };
      
      let currentRow = 6;
      
      // Process each user in the department
      for (const user of department.members) {
        // User info rows
        ws.getRow(currentRow).getCell('A').value = 'Emp. Code :';
        ws.getRow(currentRow).getCell('A').font = { size: fontSize };
        ws.getRow(currentRow).getCell('B').value = user.employee_code || '';
        ws.getRow(currentRow).getCell('B').font = { size: fontSize };
        currentRow++;
        
        ws.getRow(currentRow).getCell('A').value = 'Emp. Name :';
        ws.getRow(currentRow).getCell('A').font = { size: fontSize };
        ws.getRow(currentRow).getCell('B').value = user.full_name;
        ws.getRow(currentRow).getCell('B').font = { size: fontSize };
        currentRow++;
        
        // Get attendance data for this user
        const params = new URLSearchParams();
        params.append('employee_code', user.employee_code);
        params.append('month', selectedMonth);
        params.append('year', selectedYear);
        
        const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          const records = data.success && data.records ? data.records : [];
          
          if (records.length > 0) {
            // Create attendance table for this user
            const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Days header row
            ws.getRow(currentRow).getCell('A').value = 'Days';
            ws.getRow(currentRow).getCell('A').font = { bold: true, size: fontSize };
            
            // Add day columns (1 T, 2 W, 3 Th, etc.)
            let colIndex = 1; // Start from B column
            for (let day = 1; day <= endDate.getDate(); day++) {
              const date = new Date(year, selectedMonth - 1, day);
              const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'St'];
              const dayName = dayNames[date.getDay()];
              const colLetter = getColumnLetter(colIndex + 1);
              
              ws.getRow(currentRow).getCell(colLetter).value = `${day} ${dayName}`;
              ws.getRow(currentRow).getCell(colLetter).font = { bold: true, size: fontSize };
              colIndex++;
            }
            currentRow++;
            
            // Status row
            ws.getRow(currentRow).getCell('A').value = 'Status';
            ws.getRow(currentRow).getCell('A').font = { size: fontSize };
            
            colIndex = 1;
            for (let day = 1; day <= endDate.getDate(); day++) {
              const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = sortedRecords.find(r => r.date === dateStr);
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
            
            // InTime row
            ws.getRow(currentRow).getCell('A').value = 'InTime';
            ws.getRow(currentRow).getCell('A').font = { size: fontSize };
            
            colIndex = 1;
            for (let day = 1; day <= endDate.getDate(); day++) {
              const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = sortedRecords.find(r => r.date === dateStr);
              const colLetter = getColumnLetter(colIndex + 1);
              
              if (record && record.in_time) {
                ws.getRow(currentRow).getCell(colLetter).value = record.in_time;
              }
              ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
              colIndex++;
            }
            currentRow++;
            
            // OutTime row
            ws.getRow(currentRow).getCell('A').value = 'OutTime';
            ws.getRow(currentRow).getCell('A').font = { size: fontSize };
            
            colIndex = 1;
            for (let day = 1; day <= endDate.getDate(); day++) {
              const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = sortedRecords.find(r => r.date === dateStr);
              const colLetter = getColumnLetter(colIndex + 1);
              
              if (record && record.out_time) {
                ws.getRow(currentRow).getCell(colLetter).value = record.out_time;
              }
              ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
              colIndex++;
            }
            currentRow++;
            
            // Total row
            ws.getRow(currentRow).getCell('A').value = 'Total';
            ws.getRow(currentRow).getCell('A').font = { size: fontSize };
            
            colIndex = 1;
            for (let day = 1; day <= endDate.getDate(); day++) {
              const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = sortedRecords.find(r => r.date === dateStr);
                              const colLetter = getColumnLetter(colIndex + 1);
                
                if (record && record.in_time && record.out_time) {
                  // Calculate total hours
                  const [ih, im] = record.in_time.split(':').map(Number);
                  const [oh, om] = record.out_time.split(':').map(Number);
                  if (!isNaN(ih) && !isNaN(im) && !isNaN(oh) && !isNaN(om)) {
                    let mins = (oh * 60 + om) - (ih * 60 + im);
                    if (mins < 0) mins += 24 * 60;
                    const h = String(Math.floor(mins / 60)).padStart(2, '0');
                    const m = String(mins % 60).padStart(2, '0');
                    ws.getRow(currentRow).getCell(colLetter).value = `${h}:${m}`;
                  } else {
                    ws.getRow(currentRow).getCell(colLetter).value = '00:00';
                  }
                } else {
                  ws.getRow(currentRow).getCell(colLetter).value = '00:00';
                }
                ws.getRow(currentRow).getCell(colLetter).font = { size: fontSize };
              colIndex++;
            }
            currentRow++;
          }
        }
        
        // Add some spacing between users
        currentRow += 2;
      }
      
      // Apply borders to all cells
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = { 
            top: { style: 'thin' }, 
            left: { style: 'thin' }, 
            bottom: { style: 'thin' }, 
            right: { style: 'thin' } 
          };
        });
      });
      
      // Set column widths
      ws.getColumn('A').width = 12;
      for (let i = 1; i <= endDate.getDate(); i++) {
        const colLetter = getColumnLetter(i + 1);
        ws.getColumn(colLetter).width = 8;
      }
      
      const blob = await wb.xlsx.writeBuffer();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${department.name.replace(/\s+/g, '_')}_${monthName}_${selectedYear}_Attendance.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification(`${department.name} attendance exported successfully`, 'success');
    } catch (error) {
      console.error('Error exporting department data:', error);
      showNotification('Error exporting department data', 'error');
    }
  };

  const getAttendanceRate = (employeeCode) => {
    const stats = userStats[employeeCode];
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
        
        loadData();
      } else if (eventType === 'attendance_updated') {
        
        fetchUserStats();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, selectedMonth, selectedYear]);

  // Update departments when users change
  useEffect(() => {
    if (users.length > 0) {
      fetchDepartments();
    }
  }, [users, fetchDepartments]);

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
          backgroundColor: theme.palette.grey[50],
          overflow: 'hidden',
          maxWidth: '100vw'
        }}
      >
        <Container maxWidth="lg">
          {/* Company Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                mb: 1
              }}
            >
              DCM INFOTECH
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                color: theme.palette.text.secondary,
                fontSize: '1.1rem'
              }}
            >
              Admin Dashboard - Employee Management System
            </Typography>
          </Box>

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

          {/* Department Cards Section */}
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Departments Overview
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {departments.map((department) => (
              <Grid item xs={12} sm={6} md={3} key={department.name}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                  onClick={() => handleDepartmentClick(department)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          borderRadius: 1, 
                          backgroundColor: theme.palette.primary.light + '22',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}
                      >
                        {getDepartmentIcon(department.name)}
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}
                      >
                        {department.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 1
                      }}
                    >
                      {department.memberCount}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontFamily: "'Poppins', sans-serif"
                      }}
                    >
                      Team Members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            All Employees
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No employees found</Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 2, overflow: 'hidden' }}>
              <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>Emp Code</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Present</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Absent</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Total Days</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>PL</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>CL</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>SL</th>
                      <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => (searchName ? u.full_name.toLowerCase().includes(searchName.toLowerCase()) : true))
                      .filter(u => (searchCode ? String(u.employee_code || '').includes(searchCode) : true))
                      .map(user => {
                        const stats = userStats[user.employee_code] || { present_days: 0, absent_days: 0, total_days: 0 };
                        const totalDays = stats.total_days || (stats.present_days + stats.absent_days);
                        const leaveBalances = userLeaveBalances[user.employee_code] || { pl: 18, cl: 7, sl: 7 };
                        return (
                          <tr key={user.id}>
                            <td style={{ padding: 8 }}>{user.employee_code || ''}</td>
                            <td style={{ padding: 8 }}>{user.full_name}</td>
                            <td style={{ padding: 8 }}>{user.email}</td>
                            <td style={{ padding: 8 }}>{stats.present_days || 0}</td>
                            <td style={{ padding: 8 }}>{stats.absent_days || 0}</td>
                            <td style={{ padding: 8 }}>{totalDays || 0}</td>
                            <td style={{ padding: 8 }}>{leaveBalances.pl || 18}</td>
                            <td style={{ padding: 8 }}>{leaveBalances.cl || 7}</td>
                            <td style={{ padding: 8 }}>{leaveBalances.sl || 7}</td>
                            <td style={{ padding: 8 }}>
                              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportUserData(user.employee_code, user.full_name)}>
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

      {/* Department Members Dialog */}
      <Dialog 
        open={departmentDialogOpen} 
        onClose={() => setDepartmentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {selectedDepartment && getDepartmentIcon(selectedDepartment.name)}
              <Typography variant="h6">
                {selectedDepartment?.name} - Team Members
              </Typography>
            </Box>
            <IconButton onClick={() => setDepartmentDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {departmentMembers.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Present Days</TableCell>
                    <TableCell>Absent Days</TableCell>
                    <TableCell>Attendance Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentMembers.map((member) => {
                    const stats = userStats[member.employee_code] || { present_days: 0, absent_days: 0 };
                    const attendanceRate = getAttendanceRate(member.employee_code);
                    return (
                      <TableRow key={member.id}>
                        <TableCell>{member.employee_code || '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                              {getUserInitials(member.full_name)}
                            </Avatar>
                            {member.full_name}
                          </Box>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stats.present_days || 0} 
                            color="success" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={stats.absent_days || 0} 
                            color="error" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${attendanceRate}%`} 
                            color={attendanceRate >= 80 ? 'success' : attendanceRate >= 60 ? 'warning' : 'error'}
                            size="small" 
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No team members found for this department.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={() => exportDepartmentData(selectedDepartment)}
            sx={{ mr: 1 }}
          >
            Export Users Attendance
          </Button>
          <Button onClick={() => setDepartmentDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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