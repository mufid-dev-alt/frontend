import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment
} from '@mui/material';
import {
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Edit as EditIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  EventBusy as OffIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import { API_ENDPOINTS } from '../../config/api';
import userService from '../../config/userService';
import eventService from '../../config/eventService';
import ExcelJS from 'exceljs';

const AttendanceRecords = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [timeDialog, setTimeDialog] = useState({ open: false, date: null, in_time: '', out_time: '' });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const showNotification = useCallback((message, severity) => {
    setNotification({ open: true, message, severity });
  }, []);

  // Fetch users using the centralized user service
  const fetchUsers = useCallback(async () => {
    try {
      const usersList = await userService.getUsers();
      const nonAdminUsers = usersList.filter(user => user.role !== 'admin');
      setUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(user.employee_code || '').includes(searchCode)
      ));
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    }
  }, [showNotification, searchQuery]);

  const fetchUserAttendance = useCallback(async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('user_id', selectedUser.id);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Attendance data received:', data);
        const records = Array.isArray(data.records) ? data.records : [];
        console.log('Processed attendance records:', records);
        setAttendanceData(records);
      }
    } catch (error) {
      showNotification('Error fetching attendance data', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedUser, selectedMonth, selectedYear, showNotification]);

  const updateAttendance = async (date, status) => {
    try {
      const response = await fetch(API_ENDPOINTS.attendance.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          status: status,
          date: date,
          notes: `Updated by admin on ${new Date().toLocaleString()}`
        })
      });

      if (response.ok) {
        showNotification(`Attendance marked as ${status} for ${date}`, 'success');
        
        // Notify other components about the attendance update using eventService
        eventService.attendanceUpdated(selectedUser.id, date, status);
        
        fetchUserAttendance();
      } else {
        throw new Error('Failed to update attendance');
      }
    } catch (error) {
      showNotification('Error updating attendance', 'error');
    }
  };

  const exportUserAttendance = async () => {
    if (!selectedUser) return;
    
    setDownloading(true);
    try {
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
      ws.mergeCells('A1:Z1');
      ws.getRow(1).getCell('A').value = 'Monthly Status Report (Basic Work Duration)';
      ws.getRow(1).getCell('A').alignment = { horizontal: 'center' };
      ws.getRow(1).getCell('A').font = { bold: true, size: fontSize };
      
      ws.mergeCells('A2:Z2');
      ws.getRow(2).getCell('A').value = dateRange;
      ws.getRow(2).getCell('A').alignment = { horizontal: 'center' };
      ws.getRow(2).getCell('A').font = { size: fontSize };
      
      ws.mergeCells('A3:Z3');
      ws.getRow(3).getCell('A').value = 'COMPANY : DCM INFOTECH LIMITED';
      ws.getRow(3).getCell('A').font = { size: fontSize };
      
      ws.mergeCells('A4:Z4');
      ws.getRow(4).getCell('A').value = `DEPARTMENT NAME : ${selectedUser.department || 'General'}`;
      ws.getRow(4).getCell('A').font = { bold: true, size: fontSize };
      
      // User info rows
      ws.getRow(5).getCell('A').value = 'Emp. Code :';
      ws.getRow(5).getCell('A').font = { size: fontSize };
      ws.getRow(5).getCell('B').value = selectedUser.employee_code || '';
      ws.getRow(5).getCell('B').font = { size: fontSize };
      
      ws.getRow(6).getCell('A').value = 'Emp. Name :';
      ws.getRow(6).getCell('A').font = { size: fontSize };
      ws.getRow(6).getCell('B').value = selectedUser.full_name;
      ws.getRow(6).getCell('B').font = { size: fontSize };
      
      const headerRowIndex = 8;
      const sorted = [...attendanceData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
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
          ws.getRow(currentRow).getCell(colLetter).value = record.status === 'present' ? 'P' : 'A';
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
      a.download = `${selectedUser.full_name.replace(/\s+/g, '_')}_${monthName}_${selectedYear}_Attendance.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification('Attendance exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting attendance:', error);
      showNotification('Error exporting attendance', 'error');
    } finally {
      setDownloading(false);
    }
  };

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

  const generateCalendarData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const calendarData = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarData.push({ isEmpty: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const attendanceRecord = attendanceData.find(record => record.date === dateStr);
      
      calendarData.push({
        day,
        date: dateStr,
        status: attendanceRecord?.status || null,
        isWeekend,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        in_time: attendanceRecord?.in_time || '',
        out_time: attendanceRecord?.out_time || ''
      });
    }

    return calendarData;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  // Time input utility functions
  const clampAndPadTime = (timeStr) => {
    const [h = '0', m = '0'] = timeStr.split(':');
    const hours = Math.max(0, Math.min(23, parseInt(h) || 0));
    const minutes = Math.max(0, Math.min(59, parseInt(m) || 0));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    return clampAndPadTime(timeStr);
  };

  // Time input component
  const TimeHMInput = ({ label, value, onChange }) => {
    const parse = (v) => {
      const [h = '', m = ''] = (v || '').split(':');
      return [h.replace(/\D/g, '').slice(0, 2), m.replace(/\D/g, '').slice(0, 2)];
    };
    const [hh, setHh] = useState(parse(value)[0]);
    const [mm, setMm] = useState(parse(value)[1]);

    useEffect(() => {
      const [ph, pm] = parse(value);
      setHh(ph);
      setMm(pm);
    }, [value]);

    const handleHhChange = (e) => {
      const d = (e.target.value || '').replace(/\D/g, '').slice(0, 2);
      setHh(d);
    };
    
    const handleMmChange = (e) => {
      const d = (e.target.value || '').replace(/\D/g, '').slice(0, 2);
      setMm(d);
    };

    const handleBlur = () => {
      const timeStr = `${hh}:${mm}`;
      const c = clampAndPadTime(timeStr);
      const [nh, nm] = c.split(':');
      
      setHh(nh);
      setMm(nm);
      onChange(c);
    };

    const handleArrowClick = (field, direction) => {
      const currentTimeStr = `${hh}:${mm}`;
      let [h, m] = currentTimeStr.split(':').map(Number);
      
      if (field === 'hh') {
        h = direction === 'up' ? h + 1 : h - 1;
        if (h > 23) h = 0;
        if (h < 0) h = 23;
      } else if (field === 'mm') {
        m = direction === 'up' ? m + 1 : m - 1;
        if (m > 59) m = 0;
        if (m < 0) m = 59;
      }

      const newTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      onChange(newTimeStr);
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" sx={{ 
          fontWeight: 600, 
          color: 'text.secondary',
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              value={hh}
              onChange={handleHhChange}
              onBlur={handleBlur}
              placeholder="HH"
              inputProps={{ 
                inputMode: 'numeric', 
                pattern: '[0-9]*', 
                maxLength: 2, 
                style: { 
                  textAlign: 'center', 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                } 
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  width: { xs: 60, sm: 70 },
                  height: { xs: 40, sm: 48 }
                } 
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0.25, sm: 0.5 } }}>
              <IconButton 
                size="small" 
                onClick={() => handleArrowClick('hh', 'up')}
                sx={{ padding: { xs: 0.5, sm: 1 } }}
              >
                <KeyboardArrowUpIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleArrowClick('hh', 'down')}
                sx={{ padding: { xs: 0.5, sm: 1 } }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
            </Box>
          </Box>
          <Typography sx={{ 
            fontWeight: 700, 
            color: 'text.disabled',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            :
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              value={mm}
              onChange={handleMmChange}
              onBlur={handleBlur}
              placeholder="MM"
              inputProps={{ 
                inputMode: 'numeric', 
                pattern: '[0-9]*', 
                maxLength: 2, 
                style: { 
                  textAlign: 'center', 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                } 
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  width: { xs: 60, sm: 70 },
                  height: { xs: 40, sm: 48 }
                } 
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0.25, sm: 0.5 } }}>
              <IconButton 
                size="small" 
                onClick={() => handleArrowClick('mm', 'up')}
                sx={{ padding: { xs: 0.5, sm: 1 } }}
              >
                <KeyboardArrowUpIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => handleArrowClick('mm', 'down')}
                sx={{ padding: { xs: 0.5, sm: 1 } }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Type HH then MM. Use arrows to adjust.
        </Typography>
      </Box>
    );
  };

  const openTimeDialog = (date, existing) => {
    setTimeDialog({ 
      open: true, 
      date, 
      in_time: existing?.in_time || '', 
      out_time: existing?.out_time || '' 
    });
  };

  const saveTimeEntry = async () => {
    try {
      const { date } = timeDialog;
      const in_time = normalizeTime(timeDialog.in_time);
      const out_time = normalizeTime(timeDialog.out_time);

      const response = await fetch(`${API_ENDPOINTS.attendance.update}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          date,
          in_time,
          out_time
        })
      });

      if (response.ok) {
        showNotification('Time entry updated successfully', 'success');
        setTimeDialog({ open: false, date: null, in_time: '', out_time: '' });
        fetchUserAttendance();
      } else {
        throw new Error('Failed to update time entry');
      }
    } catch (error) {
      showNotification('Error updating time entry', 'error');
    }
  };

  const updateStatusForDate = (date, status) => {
    updateAttendance(date, status);
  };

  // Initialize component and check auth
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [navigate]);

  // Auto-refresh users every 30 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for user updates from user service
  useEffect(() => {
    const unsubscribe = userService.subscribe((eventType, data, updatedUsers) => {
      if (['user_added', 'user_deleted', 'user_restored', 'sync_complete', 'init_complete'].includes(eventType)) {
        const nonAdminUsers = updatedUsers.filter(user => user.role !== 'admin');
        setUsers(nonAdminUsers);
        setFilteredUsers(nonAdminUsers.filter(user => 
          user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      }
    });
    
    return () => unsubscribe();
  }, [searchQuery]);

  // Only fetch users on component mount and via refresh button

  useEffect(() => {
    if (selectedUser) {
      fetchUserAttendance();
    }
  }, [selectedUser]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.employee_code || '').includes(searchCode)
    );
    setFilteredUsers(filtered);
  }, [users, searchQuery, searchCode]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };



  const calendarData = selectedUser ? generateCalendarData() : [];
  const presentDays = calendarData.filter(day => day.status === 'present').length;
  const absentDays = calendarData.filter(day => day.status === 'absent').length;
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add useEffect hooks for data fetching
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [fetchUsers, navigate]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserAttendance();
    }
  }, [selectedUser, fetchUserAttendance]);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, fetchUsers]);

  return (
    <>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, backgroundColor: theme.palette.grey[50], minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
            User Attendance Management
          </Typography>

          {!selectedUser ? (
            // User Selection Screen
            <Paper sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <PersonIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Select a User to Manage Attendance
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Choose a user from the list below to view and edit their attendance records
                </Typography>
              </Box>

              {/* Search Field */}
              <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      placeholder="Search by name or email..."
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      placeholder="Search by employee code..."
                      variant="outlined"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Users List */}
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'left' }}>
                  Users
                </Typography>
                <List>
                  {filteredUsers.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No users found" />
                    </ListItem>
                  )}
                  {filteredUsers.map((user) => (
                    <ListItem 
                      key={user.id}
                      button 
                      onClick={() => setSelectedUser(user)}
                      sx={{ 
                        mb: 1, 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.light,
                          color: 'white'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={user.full_name} 
                        secondary={user.email}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          ) : (
            // User-Specific Attendance View
            <Box>
              {/* Selected User Header */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                      {selectedUser.full_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {selectedUser.full_name}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {selectedUser.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={exportUserAttendance}
                      disabled={downloading}
                    >
                      {downloading ? 'Exporting...' : 'Export'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => setSelectedUser(null)}
                    >
                      Change User
                    </Button>
                  </Box>
                </Box>
              </Paper>

              {/* Month Navigation */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigateMonth('prev')}>
                      <ChevronLeftIcon />
                    </IconButton>
                    
                    <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
                      {months[selectedMonth - 1]} {selectedYear}
                    </Typography>
                    
                    <IconButton onClick={() => navigateMonth('next')}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      icon={<PresentIcon />}
                      label={`Present: ${presentDays}`}
                      color="success"
                      variant="outlined"
                    />
                    <Chip
                      icon={<AbsentIcon />}
                      label={`Absent: ${absentDays}`}
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Calendar View */}
              <Paper sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ maxWidth: { xs: '100%', sm: '500px', md: '600px' }, mx: 'auto' }}>
                    {/* Calendar Header */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: { xs: 0.3, sm: 0.5 }, mb: 1 }}>
                      {weekDays.map((day) => (
                        <Typography
                          key={day}
                          variant="body2"
                          sx={{
                            textAlign: 'center',
                            fontWeight: 600,
                            p: { xs: 0.5, sm: 0.8 },
                            bgcolor: theme.palette.grey[100],
                            borderRadius: 1,
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                          }}
                        >
                          {day}
                        </Typography>
                      ))}
                    </Box>

                    {/* Calendar Days */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(7, 1fr)', 
                      gap: { xs: 0.3, sm: 0.5 },
                      maxWidth: '100%'
                    }}>
                      {calendarData.map((dayData, index) => (
                        <Box key={index} sx={{ aspectRatio: '1/1', maxWidth: '100px' }}>
                          {dayData.isEmpty ? (
                            <Box sx={{ height: '100%' }} />
                          ) : (
                            <Card
                              sx={{
                                height: '100%',
                                minHeight: { xs: 40, sm: 45, md: 50 },
                                maxHeight: { xs: 45, sm: 50, md: 60 },
                                cursor: dayData.isWeekend ? 'default' : 'pointer',
                                bgcolor: dayData.isWeekend
                                  ? theme.palette.grey[100]
                                  : dayData.status === 'present'
                                  ? theme.palette.success.light
                                  : dayData.status === 'absent'
                                  ? theme.palette.error.light
                                  : theme.palette.background.paper,
                                border: dayData.isToday ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                                borderColor: dayData.isToday ? theme.palette.primary.main : theme.palette.divider,
                                '&:hover': !dayData.isWeekend ? {
                                  boxShadow: theme.shadows[2],
                                  transform: 'translateY(-1px)'
                                } : {},
                                display: 'flex',
                                flexDirection: 'column'
                              }}
                              onClick={() => {
                                if (!dayData.isWeekend) {
                                  openTimeDialog(dayData.date, dayData);
                                }
                              }}
                            >
                              <CardContent sx={{ 
                                p: { xs: 0.3, sm: 0.5 }, 
                                textAlign: 'center', 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                '&:last-child': { pb: { xs: 0.3, sm: 0.5 } }
                              }}>
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 600, 
                                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                                  lineHeight: 1
                                }}>
                                  {dayData.day}
                                </Typography>
                                
                                {dayData.isWeekend ? (
                                  <Typography variant="caption" color="textSecondary" sx={{ 
                                    fontSize: { xs: '0.5rem', sm: '0.55rem', md: '0.6rem' },
                                    lineHeight: 1
                                  }}>
                                    OFF
                                  </Typography>
                                ) : dayData.status ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                    {dayData.status === 'present' ? (
                                      <PresentIcon sx={{ fontSize: { xs: 10, sm: 12, md: 14 }, color: theme.palette.success.main }} />
                                    ) : (
                                      <AbsentIcon sx={{ fontSize: { xs: 10, sm: 12, md: 14 }, color: theme.palette.error.main }} />
                                    )}
                                    {(dayData.in_time || dayData.out_time) && (
                                      <Typography variant="caption" sx={{ 
                                        fontSize: { xs: '0.4rem', sm: '0.45rem', md: '0.5rem' },
                                        lineHeight: 1,
                                        color: theme.palette.text.secondary
                                      }}>
                                        {dayData.in_time ? `IN ${dayData.in_time}` : ''} 
                                        {dayData.out_time ? `OUT ${dayData.out_time}` : ''}
                                      </Typography>
                                    )}
                                  </Box>
                                ) : (
                                  <Typography variant="caption" color="textSecondary" sx={{ 
                                    fontSize: { xs: '0.45rem', sm: '0.5rem', md: '0.55rem' },
                                    lineHeight: 1
                                  }}>
                                    Click
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </Container>



        {/* Time Entry Dialog */}
        <Dialog 
          open={timeDialog.open} 
          onClose={() => setTimeDialog({ open: false, date: null, in_time: '', out_time: '' })} 
          maxWidth="sm" 
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              margin: { xs: 1, sm: 2 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' }
            }
          }}
        >
          <DialogTitle sx={{ pb: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon color="primary" />
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Set In/Out Time
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}>
            <Typography variant="body2" sx={{ 
              mb: { xs: 2, sm: 3 }, 
              p: { xs: 1.5, sm: 2 }, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              <strong>Date:</strong> {timeDialog.date ? new Date(timeDialog.date).toLocaleDateString() : ''}
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TimeHMInput
                  label="In Time (HH:MM)"
                  value={timeDialog.in_time}
                  onChange={(next) => setTimeDialog((p) => ({ ...p, in_time: typeof next === 'string' ? next : next?.target?.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimeHMInput
                  label="Out Time (HH:MM)"
                  value={timeDialog.out_time}
                  onChange={(next) => setTimeDialog((p) => ({ ...p, out_time: typeof next === 'string' ? next : next?.target?.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 }, 
            pt: 0,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 1 }, 
              alignItems: { xs: 'stretch', sm: 'center' },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button 
                size="small" 
                color="success" 
                variant="outlined" 
                startIcon={<PresentIcon />} 
                onClick={() => updateStatusForDate(timeDialog.date, 'present')}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Mark Present
              </Button>
              <Button 
                size="small" 
                color="error" 
                variant="outlined" 
                startIcon={<AbsentIcon />} 
                onClick={() => updateStatusForDate(timeDialog.date, 'absent')}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Mark Absent
              </Button>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 1 },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button 
                onClick={() => setTimeDialog({ open: false, date: null, in_time: '', out_time: '' })}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveTimeEntry} 
                variant="contained"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Save
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default AttendanceRecords; 