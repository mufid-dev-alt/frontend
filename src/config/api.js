// API config
const BASE_URL = (process.env.REACT_APP_API_URL || 'https://backend-9z1y.onrender.com').replace(/\/+$/, '');

// Log the base URL being used (for debugging in development only)
if (process.env.NODE_ENV === 'development') {
}

export const API_ENDPOINTS = {
  // Users
  users: {
    list: `${BASE_URL}/api/users`,
    create: `${BASE_URL}/api/users`,
    update: `${BASE_URL}/api/users`,
    changePassword: `${BASE_URL}/api/users/change-password`,
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
  leave: {
    balances: (employeeCode) => `${BASE_URL}/api/leave/balances/${employeeCode}`,
    apply: `${BASE_URL}/api/leave/apply`,
    cancel: `${BASE_URL}/api/leave/cancel`,
    rollover: (year) => `${BASE_URL}/api/leave/rollover/${year}`,
  },
  system: {
    simulateDate: `${BASE_URL}/api/system/simulate-date`,
  },

  messages: {
    list: `${BASE_URL}/api/messages`,
    create: `${BASE_URL}/api/messages`,
    delete: (messageId) => `${BASE_URL}/api/messages/${messageId}`,
    getByUser: (userId) => `${BASE_URL}/api/messages/${userId}`,
    getConversation: (senderId, receiverId) => `${BASE_URL}/api/messages?sender_id=${senderId}&receiver_id=${receiverId}`,
  },
  chat: {
    userByEmployeeCode: (code) => `${BASE_URL}/api/users/by-employee-code/${code}`,
    conversations: (userId) => `${BASE_URL}/api/conversations/${userId}`,
  },
  teams: {
    departmentMembers: `${BASE_URL}/api/teams/department/{department}`,
    userDepartment: (userId) => `${BASE_URL}/api/teams/user/${userId}/department`,
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
}

// API request utility
export const apiRequest = async (url, options = {}) => {
  try {
    if (process.env.NODE_ENV === 'development') {
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