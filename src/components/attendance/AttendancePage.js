
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  Undo as UndoIcon,
  Refresh as RefreshIcon,
  AccessTime as TimeIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventAvailable as EventAvailableIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import { API_ENDPOINTS } from '../../config/api';
import ExcelJS from 'exceljs';
import eventService from '../../config/eventService';

const AttendancePage = ({ userId, readOnly = false, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [todayMarked, setTodayMarked] = useState(false);
  const [todayAttendanceId, setTodayAttendanceId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [timeDialog, setTimeDialog] = useState({ open: false, date: null, in_time: '', out_time: '' });

  // Use provided userId or get from localStorage
  const currentUserId = userId || JSON.parse(localStorage.getItem('user'))?.id;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Check if today is weekend
  const isWeekend = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  };

  // Force sync attendance data with the backend
  const forceSync = async () => {
    try {
      setMessage('Syncing attendance data...');
      const response = await fetch(API_ENDPOINTS.attendance.sync, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(`Attendance data synced successfully (${result.record_count} records)`);
        // Refresh attendance data
        await fetchAttendance();
      } else {
        throw new Error('Failed to sync attendance data');
      }
    } catch (error) {
      setMessage('Error syncing attendance data');
      console.error('Error:', error);
    }
  };

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      if (!currentUserId) {
        if (!readOnly) {
        navigate('/');
        }
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.attendance.list}?user_id=${currentUserId}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/');
          return;
        }
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      setAttendanceData(Array.isArray(data.records) ? data.records : []);
      
      // Check if today's attendance is already marked
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = (Array.isArray(data.records) ? data.records : []).find(record => record.date === today);
      setTodayMarked(!!todayRecord);
      setTodayAttendanceId(todayRecord?.id || null);
    } catch (error) {
      setMessage('Error fetching attendance data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const markAttendance = async (status) => {
    setMarkingAttendance(true);
    setMessage('');
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(API_ENDPOINTS.attendance.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          user_id: userData.id,
          status: status,
          date: today,
          notes: `Marked via app on ${new Date().toLocaleString()}`
        })
      });
      if (!response.ok) throw new Error('Failed to mark attendance');
      await fetchAttendance();
      setMessage(`Attendance marked as ${status} successfully!`);
    } catch (error) {
      setMessage('Error marking attendance');
    } finally {
      setMarkingAttendance(false);
    }
  };

  const openTimeDialog = (date, existing) => {
    setTimeDialog({ open: true, date, in_time: existing?.in_time || '', out_time: existing?.out_time || '' });
  };

  const normalizeTime = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length === 0) return '';
    const hh = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    let hour = parseInt(hh, 10);
    if (isNaN(hour)) hour = 0;
    if (hour > 23) hour = 23;
    let minute = parseInt(mm || '0', 10);
    if (isNaN(minute)) minute = 0;
    if (minute > 59) minute = 59;
    const hhs = String(hour).padStart(2, '0');
    const mms = String(minute).padStart(2, '0');
    return `${hhs}:${mms}`;
  };

  const clampAndPadTime = (timeStr) => {
    if (!timeStr) return '00:00';
    const [hRaw = '0', mRaw = '0'] = (timeStr.includes(':') ? timeStr : normalizeTime(timeStr)).split(':');
    let h = parseInt(hRaw, 10);
    if (isNaN(h)) h = 0;
    h = Math.max(0, Math.min(23, h));
    let m = parseInt(mRaw, 10);
    if (isNaN(m)) m = 0;
    m = Math.max(0, Math.min(59, m));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateTotalHours = (inTime, outTime) => {
    if (!inTime || !outTime) return '';
    
    const [ih, im] = inTime.split(':').map(Number);
    const [oh, om] = outTime.split(':').map(Number);
    
    if (isNaN(ih) || isNaN(im) || isNaN(oh) || isNaN(om)) return '';
    
    let mins = (oh * 60 + om) - (ih * 60 + im);
    if (mins < 0) mins += 24 * 60; // Handle overnight shifts
    
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const handleTimeChange = (field) => (e) => {
    const raw = e.target.value || '';
    // Auto-insert ':'
    const formatted = normalizeTime(raw);
    setTimeDialog((prev) => ({ ...prev, [field]: formatted }));
  };

  // Redesigned HH:MM input with two boxes (HH and MM) and arrow buttons.
  const TimeHMInput = ({ label, value, onChange }) => {
    const parse = (v) => {
      const [h = '', m = ''] = (v || '').split(':');
      return [h.replace(/\D/g, '').slice(0, 2), m.replace(/\D/g, '').slice(0, 2)];
    };
    const [hh, setHh] = useState(parse(value)[0]);
    const [mm, setMm] = useState(parse(value)[1]);
    const hhRef = useRef(null);
    const mmRef = useRef(null);

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

    const handleHhKeyDown = (e) => {
      if ((e.key === 'Tab' || e.key === 'Enter') && hh.length === 2 && mmRef.current) {
        e.preventDefault();
        mmRef.current.focus();
      }
    };
    
    const handleMmKeyDown = (e) => {
      if (e.key === 'Backspace' && mm.length === 0 && hhRef.current) {
        e.preventDefault();
        hhRef.current.focus();
      }
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
              inputRef={hhRef}
              value={hh}
              onChange={handleHhChange}
              onBlur={handleBlur}
              onKeyDown={handleHhKeyDown}
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
              inputRef={mmRef}
              value={mm}
              onChange={handleMmChange}
              onBlur={handleBlur}
              onKeyDown={handleMmKeyDown}
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

  const saveTimeEntry = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const { date } = timeDialog;
      const in_time = normalizeTime(timeDialog.in_time);
      const out_time = normalizeTime(timeDialog.out_time);
      const response = await fetch(API_ENDPOINTS.attendance.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        // If component receives a specific userId (e.g., when used by admin), update that user's attendance
        body: JSON.stringify({ user_id: currentUserId || userData.id, status: 'present', date, in_time, out_time, notes: 'Time entry update' })
      });
      if (!response.ok) throw new Error('Failed to save time');
      setTimeDialog({ open: false, date: null, in_time: '', out_time: '' });
      await fetchAttendance();
      setMessage('Time updated successfully');
    } catch (e) {
      setMessage('Error saving time');
    }
  };

  const updateStatusForDate = async (date, status) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(API_ENDPOINTS.attendance.create, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ user_id: userData.id, status, date, notes: `Marked ${status} via dialog` })
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchAttendance();
      setMessage(`Attendance marked as ${status} successfully!`);
      setTimeDialog({ open: false, date: null, in_time: '', out_time: '' });
    } catch (e) {
      setMessage('Error updating attendance status');
    }
  };

  const undoTodayAttendance = async () => {
    if (!todayAttendanceId) return;
    
    setMarkingAttendance(true);
    setMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.attendance.delete(todayAttendanceId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to undo attendance');
      }

      setMessage('Today\'s attendance has been undone');
      setTodayMarked(false);
      setTodayAttendanceId(null);
      
      // Force sync with backend to ensure data is persisted
      await forceSync();
      
      // Refresh attendance data
      await fetchAttendance();
    } catch (error) {
      setMessage('Error undoing attendance');
      console.error('Error:', error);
    } finally {
      setMarkingAttendance(false);
    }
  };

  const downloadMyAttendance = async () => {
    setDownloading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const params = new URLSearchParams();
      params.append('user_id', userData.id);
      params.append('month', selectedMonth);
      params.append('year', selectedYear);
      
      const response = await fetch(`${API_ENDPOINTS.attendance.list}?${params.toString()}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const records = Array.isArray(data.records) ? data.records : [];
        if (records.length === 0) {
          setMessage('No attendance data found for the selected period');
          setDownloading(false);
          return;
        }
        
        // Create nicely formatted Excel workbook
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Attendance');
        const monthName = months[selectedMonth - 1];
        // Title row
        ws.mergeCells('A1:F1');
        ws.getCell('A1').value = 'DCM Infotech';
        ws.getCell('A1').alignment = { horizontal: 'center' };
        ws.getCell('A1').font = { bold: true };
        // Dept row
        ws.mergeCells('A2:F2');
        ws.getCell('A2').value = `Department Name - ${userData.department || 'General'}`;
        // Employee rows
        ws.getCell('A3').value = 'Employee Name';
        ws.getCell('B3').value = userData.full_name;
        ws.getCell('A4').value = 'Employee Code';
        ws.getCell('B4').value = userData.employee_code || '';
        // Header
        const headerRowIndex = 5;
        ws.getRow(headerRowIndex).values = ['DATE', 'DAY', 'ATTENDANCE', 'IN-Time', 'OUT-Time', 'Total Hours'];
        ws.getRow(headerRowIndex).font = { bold: true };
        // Data
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
        // Borders for all used cells
        const range = ws.getCell(`F${rowPtr - 1}`).$col$row; // not used; iterate rows instead
        ws.eachRow((row, rowNumber) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });
        // Column widths
        ws.columns = [
          { width: 14 },
          { width: 14 },
          { width: 14 },
          { width: 12 },
          { width: 12 },
          { width: 14 },
        ];
        const blob = await wb.xlsx.writeBuffer();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${userData.full_name.replace(/\s+/g, '_')}_${monthName}_${selectedYear}_Attendance.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage('Attendance data downloaded successfully');
      } else {
        throw new Error(`Download failed: ${response.status}`);
      }
    } catch (error) {
      setMessage('Error downloading attendance data');
    } finally {
      setDownloading(false);
    }
  };

  const convertToExcelFormat = (data, userData) => {
    // New single-user export format with IN/OUT and total hours
    const header = ['DCM Infotech', '', ''].join(',');
    let csv = `${header}\n`;
    csv += `Department Name - Telecom Service Department\n`;
    csv += `Employee Name,${userData.full_name}\n`;
    csv += `Employee Code,${userData.employee_code || ''}\n`;
    csv += `DATE,DAY,ATTENDANCE,IN-Time,OUT-Time,Total Hours\n`;
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
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
      const inT = r.in_time || '';
      const outT = r.out_time || '';
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
    fetchAttendance();
  }, [fetchAttendance, navigate]);
  
  // No event-based refresh - user will manually sync when needed
  
  // No auto-refresh - user will manually sync when needed

  // Generate calendar data for the selected month
  const generateCalendarData = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const calendarData = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarData.push({ isEmpty: true });
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(selectedYear, selectedMonth - 1, day).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      const attendanceRecord = (Array.isArray(attendanceData) ? attendanceData : []).find(record => record.date === dateStr);
      
      calendarData.push({
        day,
        date: dateStr,
        status: attendanceRecord?.status || null,
        notes: attendanceRecord?.notes || null,
        isWeekend,
        in_time: attendanceRecord?.in_time || '',
        out_time: attendanceRecord?.out_time || ''
      });
    }

    return calendarData;
  };

  const calendarData = generateCalendarData();
  const presentDays = calendarData.filter(day => day.status === 'present').length;
  const absentDays = calendarData.filter(day => day.status === 'absent').length;
  const totalMarkedDays = presentDays + absentDays;

  const getStatusColor = (status, isWeekend) => {
    if (isWeekend) {
      return theme.palette.grey[200]; // Light gray for weekends
    }
    switch (status) {
      case 'present': return theme.palette.success.main;
      case 'absent': return theme.palette.error.main;
      default: return theme.palette.background.paper; // White for unmarked weekdays
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <PresentIcon sx={{ fontSize: 16, color: 'white' }} />;
      case 'absent': return <AbsentIcon sx={{ fontSize: 16, color: 'white' }} />;
      default: return null;
  }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sidebar Component
  const Sidebar = ({ open, onClose }) => {
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

  return (
    <>
      {!readOnly && (
        <>
          <AppBar 
            position="fixed" 
            sx={{ 
              borderRadius: 0,
              boxShadow: 'none',
              borderBottom: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
          >
            <Toolbar sx={{ minHeight: '64px !important' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 600,
                  color: 'white'
                }}
              >
                Office Attendance Management
              </Typography>
            </Toolbar>
          </AppBar>
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
        </>
      )}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 1, sm: 2, md: 3 }, 
        mt: readOnly ? 0 : { xs: 7, sm: 8 }, 
        ml: { xs: 0, sm: readOnly ? 0 : 30 },
        backgroundColor: theme.palette.grey[50], 
        minHeight: readOnly ? 'auto' : '100vh',
        overflow: 'hidden',
        maxWidth: '100vw'
      }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Header Section - Mobile Responsive */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'stretch', sm: 'center' }, 
            mb: { xs: 2, sm: 4 },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 600, 
              color: theme.palette.primary.main,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              {readOnly ? 'Attendance Records' : 'My Attendance'}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 }, 
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' }
            }}>
              {!readOnly && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadMyAttendance}
                disabled={downloading}
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    mb: { xs: 1, sm: 0 }
                  }}
              >
                {downloading ? 'Downloading...' : 'Download Attendance'}
              </Button>
              )}
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', sm: 'row' },
                gap: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <FormControl size="small" sx={{ 
                  minWidth: { xs: '50%', sm: 120 },
                  flex: { xs: 1, sm: 'none' }
                }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
                <FormControl size="small" sx={{ 
                  minWidth: { xs: '50%', sm: 100 },
                  flex: { xs: 1, sm: 'none' }
                }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Box>
            </Box>
              </Box>

          {/* Today's Attendance Marking */}
          {!readOnly && (
            <Paper sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" sx={{ 
                mb: { xs: 1.5, sm: 2 }, 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
              Mark Today's Attendance
                                </Typography>
            
            {message && (
              <Alert 
                severity={/success|updated|downloaded|synced/i.test(message) ? 'success' : 'error'} 
                sx={{ mb: 2 }}
                onClose={() => setMessage('')}
                >
                {message}
              </Alert>
            )}

            {isWeekend() && (
              <Alert severity="info" sx={{ mb: 2 }}>
                You cannot mark attendance on Saturday and Sunday
                </Alert>
            )}

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 }, 
              alignItems: { xs: 'stretch', sm: 'center' }
            }}>
                    <Button
                      variant="contained"
                color="success"
                startIcon={<PresentIcon />}
                onClick={() => markAttendance('present')}
                disabled={markingAttendance || todayMarked || isWeekend()}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                {markingAttendance ? <CircularProgress size={20} /> : 'Present'}
                    </Button>
              
                    <Button
                      variant="contained"
                color="error"
                startIcon={<AbsentIcon />}
                onClick={() => markAttendance('absent')}
                disabled={markingAttendance || todayMarked || isWeekend()}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                {markingAttendance ? <CircularProgress size={20} /> : 'Absent'}
                    </Button>

              {todayMarked && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1, sm: 2 },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  width: { xs: '100%', sm: 'auto' }
                }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<UndoIcon />}
                    onClick={undoTodayAttendance}
                    disabled={markingAttendance || !todayAttendanceId}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Undo
                  </Button>
                <Chip 
                  label="Today's attendance already marked" 
                  color="info" 
                  size="small"
                  sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
                />
                </Box>
              )}
            </Box>
          </Paper>
          )}

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: { xs: 2, sm: 4 } }}>
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        Present Days
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.success.main,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {presentDays}
                      </Typography>
                    </Box>
                    <PresentIcon sx={{ 
                      fontSize: { xs: 30, sm: 40 }, 
                      color: theme.palette.success.main 
                    }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        Absent Days
                </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.error.main,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {absentDays}
                    </Typography>
                    </Box>
                    <AbsentIcon sx={{ 
                      fontSize: { xs: 30, sm: 40 }, 
                      color: theme.palette.error.main 
                    }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        Total Marked
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {totalMarkedDays}
                    </Typography>
                    </Box>
                    <CalendarIcon sx={{ 
                      fontSize: { xs: 30, sm: 40 }, 
                      color: theme.palette.primary.main 
                    }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom variant="h6" sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        mb: { xs: 0.5, sm: 1 }
                      }}>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.info.main,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                      }}>
                        {totalMarkedDays > 0 ? Math.round((presentDays / totalMarkedDays) * 100) : 0}%
                      </Typography>
                </Box>
                    <CalendarIcon sx={{ 
                      fontSize: { xs: 30, sm: 40 }, 
                      color: theme.palette.info.main 
                    }} />
              </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          

          {/* Monthly Calendar */}
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ 
              mb: { xs: 2, sm: 3 }, 
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              {months[selectedMonth - 1]} {selectedYear} - Attendance Calendar
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {/* Weekday Headers - Responsive */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: { xs: 0.5, sm: 1 },
                  mb: 1 
                }}>
                  {weekDays.map((day, index) => (
                      <Box
                      key={day}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: index === 0 || index === 6 ? theme.palette.grey[100] : theme.palette.primary.main,
                          color: index === 0 || index === 6 ? theme.palette.text.primary : 'white',
                        py: { xs: 0.5, sm: 1 },
                          borderRadius: 1,
                          fontWeight: 600
                        }}
      >
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.7rem', sm: '0.875rem' }
                      }}>
                          {day}
                        </Typography>
                      </Box>
                  ))}
                </Box>

                {/* Calendar Days - Responsive Grid */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: { xs: 1, sm: 1.5 },
                  p: { xs: 0.5, sm: 1 }
                }}>
                  {calendarData.map((dayData, index) => (
                    <Box key={dayData.isEmpty ? `empty-${index}` : dayData.day}>
                      {dayData.isEmpty ? (
                        <Box sx={{ minHeight: { xs: 50, sm: 60, md: 70 } }} />
                      ) : (
                        <Box
          sx={{ 
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: getStatusColor(dayData.status, dayData.isWeekend),
                            color: dayData.isWeekend ? theme.palette.text.secondary : (dayData.status ? 'white' : theme.palette.text.primary),
                            border: `2px solid ${theme.palette.divider}`,
                            borderRadius: { xs: 1, sm: 2 },
                            position: 'relative',
                            minHeight: { xs: 50, sm: 60, md: 70 },
                            cursor: readOnly ? 'default' : 'pointer',
                            boxShadow: dayData.status ? theme.shadows[2] : theme.shadows[1],
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: theme.shadows[4],
                              transform: 'translateY(-2px)',
                            },
                            '&:active': {
                              transform: 'translateY(0px)',
                              boxShadow: theme.shadows[2]
                            }
                          }}
                           title={`${dayData.date}${dayData.status ? `: ${dayData.status}` : ''}`}
                          onClick={() => { if (!dayData.isWeekend && !readOnly) { openTimeDialog(dayData.date, dayData); } }}
                        >
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            mb: { xs: 0.25, sm: 0.5 },
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                          }}>
                            {dayData.day}
                          </Typography>
                          {getStatusIcon(dayData.status)}
                          {dayData.status && (
                            <Typography variant="caption" sx={{ 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                              textTransform: 'uppercase', 
                              mt: { xs: 0.25, sm: 0.5 },
                              fontWeight: 600
                            }}>
                              {dayData.status.charAt(0)}
                            </Typography>
                          )}
                           {(dayData.in_time || dayData.out_time) && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: { xs: 0.25, sm: 0.5 } }}>
                              {dayData.in_time && (
                                <Typography variant="caption" sx={{ 
                                  fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                                  textAlign: 'center',
                                  lineHeight: 1.2
                                }}>
                                  IN {dayData.in_time}
                                </Typography>
                              )}
                              {dayData.out_time && (
                                <Typography variant="caption" sx={{ 
                                  fontSize: { xs: '0.6rem', sm: '0.65rem' }, 
                                  textAlign: 'center',
                                  lineHeight: 1.2
                                }}>
                                  OUT {dayData.out_time}
                                </Typography>
                              )}
                              {dayData.in_time && dayData.out_time && (
                                <Typography variant="caption" sx={{ 
                                  fontSize: { xs: '0.55rem', sm: '0.6rem' }, 
                                  textAlign: 'center',
                                  lineHeight: 1.2,
                                  fontWeight: 600,
                                  color: 'primary.main'
                                }}>
                                  {calculateTotalHours(dayData.in_time, dayData.out_time)}
                                </Typography>
                              )}
                            </Box>
                           )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
          
        </Container>
    </Box>
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
            <strong>Date:</strong> {timeDialog.date}
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
            <Tooltip 
              title={!timeDialog.in_time ? "Please fill in the 'In Time' before marking present" : ""}
              placement="top"
            >
              <span>
                <Button 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                  startIcon={<PresentIcon />} 
                  onClick={() => updateStatusForDate(timeDialog.date, 'present')}
                  disabled={!timeDialog.in_time}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Mark Present
                </Button>
              </span>
            </Tooltip>
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
    </>
  );
};

export default AttendancePage; 
