// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  OFFLINE_DATA: 'offline_data',
  SYNC_STATUS: 'sync_status',
  OFFLINE_COURSES: 'offline_courses',
  OFFLINE_LESSONS: 'offline_lessons',
  USER_PROGRESS: 'user_progress',
  COURSE_PROGRESS: 'course_progress',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Intellecta',
  VERSION: '1.0.0',
  THEME: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#FFFFFF',
    SURFACE: '#F2F2F7',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#3C3C43',
  },
} as const;

// Video Quality Options
export const VIDEO_QUALITY = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  AUTO: 'auto',
} as const;

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

// Supported Languages
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  CHINESE: 'zh',
  ARABIC: 'ar',
} as const;

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Network Types
export const NETWORK_TYPES = {
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  ETHERNET: 'ethernet',
  BLUETOOTH: 'bluetooth',
  VPN: 'vpn',
  UNKNOWN: 'unknown',
  NONE: 'none',
} as const;

// File Types
export const FILE_TYPES = {
  PDF: 'pdf',
  DOCUMENT: 'document',
  LINK: 'link',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;

// Error Codes
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Screen Dimensions Breakpoints
export const SCREEN_BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024,
} as const;

// Maximum Storage Limits (in bytes)
export const STORAGE_LIMITS = {
  OFFLINE_COURSES: 1024 * 1024 * 1024, // 1GB
  CACHE: 512 * 1024 * 1024, // 512MB
  PROGRESS_DATA: 50 * 1024 * 1024, // 50MB
} as const;

// Query Cache Times (in milliseconds)
export const CACHE_TIMES = {
  COURSES: 5 * 60 * 1000, // 5 minutes
  LESSONS: 10 * 60 * 1000, // 10 minutes
  USER_PROFILE: 15 * 60 * 1000, // 15 minutes
  PROGRESS: 2 * 60 * 1000, // 2 minutes
  SETTINGS: 60 * 60 * 1000, // 1 hour
} as const;
