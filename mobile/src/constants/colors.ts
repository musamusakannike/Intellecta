// Kodr - Purple Space Theme Color System
// A cosmic, deep purple theme perfect for a coding education platform

export const colors = {
  // Primary - Deep cosmic purples
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',  // Main brand color
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  // Secondary - Vibrant accent
  secondary: {
    50: '#FDF4FF',
    100: '#FAE8FF',
    200: '#F5D0FE',
    300: '#F0ABFC',
    400: '#E879F9',
    500: '#D946EF',
    600: '#C026D3',
    700: '#A21CAF',
    800: '#86198F',
    900: '#701A75',
  },
  
  // Background - Deep space blacks and grays
  background: {
    primary: '#0A0118',      // Deep space black
    secondary: '#130828',    // Slightly lighter
    tertiary: '#1A0F2E',     // Card backgrounds
    elevated: '#251A3A',     // Elevated surfaces
  },
  
  // Surface colors
  surface: {
    base: '#1A0F2E',
    elevated: '#251A3A',
    overlay: 'rgba(139, 92, 246, 0.1)',
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#C4B5FD',
    tertiary: '#A78BFA',
    disabled: '#6D28D9',
    inverse: '#0A0118',
  },
  
  // Semantic colors
  success: {
    light: '#86EFAC',
    main: '#22C55E',
    dark: '#16A34A',
  },
  
  error: {
    light: '#FCA5A5',
    main: '#EF4444',
    dark: '#DC2626',
  },
  
  warning: {
    light: '#FCD34D',
    main: '#F59E0B',
    dark: '#D97706',
  },
  
  info: {
    light: '#93C5FD',
    main: '#3B82F6',
    dark: '#2563EB',
  },
  
  // Border colors
  border: {
    light: 'rgba(139, 92, 246, 0.1)',
    main: 'rgba(139, 92, 246, 0.2)',
    strong: 'rgba(139, 92, 246, 0.3)',
  },
  
  // Code syntax highlighting
  code: {
    background: '#1A0F2E',
    text: '#E9D5FF',
    keyword: '#C084FC',
    string: '#86EFAC',
    number: '#FCD34D',
    comment: '#6D28D9',
    function: '#60A5FA',
  },
  
  // Overlay and shadow
  overlay: 'rgba(10, 1, 24, 0.8)',
  shadow: 'rgba(139, 92, 246, 0.3)',
};

export type ColorScheme = typeof colors;
