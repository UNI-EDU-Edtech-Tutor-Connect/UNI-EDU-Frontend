// ============================================
// API CONFIGURATION
// ============================================
// This file contains the configuration for API calls
// When connecting to a real backend, update BASE_URL and remove MOCK_DELAY

export const API_CONFIG = {
  // Base URL - Change this when connecting to real backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  
  // Mock delay to simulate network latency (remove in production)
  MOCK_DELAY: 800,
  
  // API Version
  VERSION: 'v1',
  
  // Timeout in milliseconds
  TIMEOUT: 30000,
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    APPROVE: (id: string) => `/users/${id}/approve`,
    REJECT: (id: string) => `/users/${id}/reject`,
    TUTORS: '/users/tutors',
    TEACHERS: '/users/teachers',
    STUDENTS: '/users/students',
    PARENTS: '/users/parents',
  },
  
  // Classes
  CLASSES: {
    LIST: '/classes',
    DETAIL: (id: string) => `/classes/${id}`,
    CREATE: '/classes',
    REGISTER: (id: string) => `/classes/${id}/register`,
    SESSIONS: '/sessions',
    SESSION_DETAIL: (id: string) => `/sessions/${id}`,
    UPDATE_ATTENDANCE: (id: string) => `/sessions/${id}/attendance`,
  },
  
  // Tests
  TESTS: {
    LIST: '/tests',
    DETAIL: (id: string) => `/tests/${id}`,
    CREATE: '/tests',
    START: (id: string) => `/tests/${id}/start`,
    SUBMIT: (attemptId: string) => `/tests/attempts/${attemptId}/submit`,
    ATTEMPTS: '/tests/attempts',
  },
  
  // Transactions
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
    CREATE: '/transactions',
    STATS: '/transactions/stats',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },
  
  // Statistics
  STATS: {
    ADMIN: '/stats/admin',
    TUTOR: '/stats/tutor',
    STUDENT: '/stats/student',
    OFFICE: '/stats/office',
    ACCOUNTANT: '/stats/accountant',
  },
  
  // Subjects
  SUBJECTS: {
    LIST: '/subjects',
    DETAIL: (id: string) => `/subjects/${id}`,
  },
}

// Helper function to delay (for mock API)
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Helper to build full URL
export const buildUrl = (endpoint: string): string => 
  `${API_CONFIG.BASE_URL}${endpoint}`
