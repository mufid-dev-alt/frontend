// API config
const BASE_URL = (process.env.REACT_APP_API_URL || 'https://backend-9z1y.onrender.com').replace(/\/+$/, '');

// Log the base URL being used (for debugging in development only)
if (process.env.NODE_ENV === 'development') {
  console.log('Using API base URL:', BASE_URL);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Raw REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
}

export const API_ENDPOINTS = {
  // Users
  users: {
    list: `${BASE_URL}/api/users`,
    create: `${BASE_URL}/api/users`,
    delete: (userId) => `${BASE_URL}/api/users/${userId}`,
    permanentDelete: (userId) => `${BASE_URL}/api/users/${userId}/permanent-delete`,
    undo: (userId) => `${BASE_URL}/api/users/${userId}/undo`,
  },
  auth: {
    login: `${BASE_URL}/api/login`,
    logout: `${BASE_URL}/api/logout`,
  },
  attendance: {
    list: `${BASE_URL}/api/attendance`,
    stats: `${BASE_URL}/api/attendance/stats`,
    create: `${BASE_URL}/api/attendance`,
    delete: (attendanceId) => `${BASE_URL}/api/attendance/${attendanceId}`,
    sync: `${BASE_URL}/api/attendance/force-sync`,
  },

  messages: {
    list: `${BASE_URL}/api/messages`,
    create: `${BASE_URL}/api/messages`,
    getByUser: (userId) => `${BASE_URL}/api/messages/${userId}`,
    getConversation: (senderId, receiverId) => `${BASE_URL}/api/messages?sender_id=${senderId}&receiver_id=${receiverId}`,
  },
  chat: {
    userByEmployeeCode: (code) => `${BASE_URL}/api/users/by-employee-code/${code}`,
    conversations: (userId) => `${BASE_URL}/api/conversations/${userId}`,
  },
  teams: {
    departmentMembers: `${BASE_URL}/api/teams/department/{department}`,
    userDepartment: `${BASE_URL}/api/teams/user/{user_id}/department`,
  },
  notifications: {
    list: (userId) => `${BASE_URL}/api/notifications/${userId}`,
    unread: (userId) => `${BASE_URL}/api/notifications/${userId}?unread_only=true`,
    create: `${BASE_URL}/api/notifications`,
    markAsRead: (notificationId) => `${BASE_URL}/api/notifications/${notificationId}/read`,
    markAllAsRead: `${BASE_URL}/api/notifications/read-all`,
  },
};

// Debug login endpoint
if (process.env.NODE_ENV === 'development') {
  console.log('Login endpoint URL:', API_ENDPOINTS.auth.login);
}

// API request utility
export const apiRequest = async (url, options = {}) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Making API request to:', url);
      console.log('Request options:', options);
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Use status text
      }
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};