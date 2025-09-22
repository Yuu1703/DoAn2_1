/**
 * constants.js - Shared constants cho toàn project
 */

// API endpoints
export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  USERS: '/api/users',
  POSTS: '/api/posts',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  MIN_LENGTH: (length) => `Tối thiểu ${length} ký tự`,
  MAX_LENGTH: (length) => `Tối đa ${length} ký tự`,
};

// Common regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+84|0)[0-9]{9,10}$/,
  VIETNAMESE_NAME: /^[a-zA-ZÀ-ỹ\s]+$/,
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};
