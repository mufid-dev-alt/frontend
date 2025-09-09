import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Save, 
  Person, 
  Email, 
  Lock, 
  Badge,
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  EventAvailable as EventAvailableIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

// Header Component
const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 600 
          }}
        >
          Settings
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            ml: 2,
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// Sidebar Component
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
          },
        }}
        open
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

const UserSettings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    employee_code: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [yearEndDialog, setYearEndDialog] = useState({
    open: false,
    year: new Date().getFullYear(),
    processing: false
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
    setFormData({
      full_name: userData.full_name || '',
      email: userData.email || '',
      employee_code: userData.employee_code || '',
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  }, [navigate]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleTogglePassword = (field) => () => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleYearEndRollover = async () => {
    setYearEndDialog({ ...yearEndDialog, processing: true });
    try {
      const response = await fetch(API_ENDPOINTS.leave.rollover(yearEndDialog.year), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to process year-end rollover');
      }

      const data = await response.json();
      if (data.success) {
        showNotification(`Year-end rollover completed successfully for ${data.processed_users} users`, 'success');
        setYearEndDialog({ open: false, year: new Date().getFullYear(), processing: false });
      } else {
        throw new Error(data.message || 'Failed to process year-end rollover');
      }
    } catch (error) {
      console.error('Error processing year-end rollover:', error);
      showNotification(error.message || 'Failed to process year-end rollover', 'error');
      setYearEndDialog({ ...yearEndDialog, processing: false });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleUpdateProfile = async () => {
    if (!formData.full_name.trim()) {
      showNotification('Full name is required', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.users.update}/${user.employee_code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        // Update local storage
        const updatedUser = { ...user, full_name: formData.full_name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        showNotification('Profile updated successfully', 'success');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.current_password) {
      showNotification('Current password is required', 'error');
      return;
    }

    if (!formData.new_password) {
      showNotification('New password is required', 'error');
      return;
    }

    if (formData.new_password.length < 6) {
      showNotification('New password must be at least 6 characters', 'error');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    if (formData.current_password === formData.new_password) {
      showNotification('New password must be different from current password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.users.changePassword}/${user.employee_code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: formData.current_password,
          new_password: formData.new_password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      const data = await response.json();
      if (data.success) {
        showNotification('Password changed successfully', 'success');
        // Clear password fields
        setFormData({
          ...formData,
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification(error.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
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
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> User Settings
            </Typography>
            
            <Divider sx={{ my: 3 }} />

            {/* Profile Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person /> Profile Information
              </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee Code"
                value={formData.employee_code}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge />
                    </InputAdornment>
                  ),
                }}
                helperText="Employee code cannot be changed"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Change Password Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Lock /> Change Password
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.current_password}
                onChange={handleChange('current_password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword('current')}
                        edge="end"
                      >
                        {showPassword.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.new_password}
                onChange={handleChange('new_password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword('new')}
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Minimum 6 characters"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={handleChange('confirm_password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword('confirm')}
                        edge="end"
                      >
                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Year-End Rollover Section - Only show for admin users */}
      {user?.role === 'admin' && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CalendarIcon /> Year-End Leave Rollover
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Process year-end rollover for all users. This will:
          </Typography>
          
          <Box component="ul" sx={{ mb: 3, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Add new annual leave allocation (PL: 18, CL: 7)
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Carry forward unused PL and CL from previous year
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Reset Sick Leave (SL) to 7 days
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                label="Year"
                type="number"
                value={yearEndDialog.year}
                onChange={(e) => setYearEndDialog({ ...yearEndDialog, year: parseInt(e.target.value) })}
                disabled={yearEndDialog.processing}
                sx={{ width: 120 }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setYearEndDialog({ ...yearEndDialog, open: true })}
                disabled={yearEndDialog.processing}
                startIcon={yearEndDialog.processing ? <CircularProgress size={20} /> : <CalendarIcon />}
              >
                Process Rollover
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Year-End Rollover Confirmation Dialog */}
      <Dialog open={yearEndDialog.open} onClose={() => setYearEndDialog({ ...yearEndDialog, open: false })}>
        <DialogTitle>Confirm Year-End Rollover</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to process year-end rollover for year {yearEndDialog.year}? 
            This action will update leave balances for all users and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setYearEndDialog({ ...yearEndDialog, open: false })}
            disabled={yearEndDialog.processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleYearEndRollover}
            disabled={yearEndDialog.processing}
            variant="contained"
          >
            {yearEndDialog.processing ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default UserSettings;
