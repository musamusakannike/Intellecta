# Intellecta Mobile App - Setup Documentation

This document outlines the complete mobile app setup for the Intellecta learning platform, configured with offline support, state management, and modern React Native development practices.

## 🏗️ Architecture Overview

The mobile app is built using:
- **Expo SDK 53** - React Native framework
- **TypeScript** - Type safety
- **React Query (TanStack Query)** - Data fetching and caching
- **Axios** - HTTP client with interceptors
- **React Context** - State management
- **AsyncStorage** - Local storage
- **React Native NetInfo** - Network monitoring
- **React Native Reanimated** - Animations
- **NativeWind** - Styling (already configured)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
│   ├── AuthContext.tsx
│   ├── SettingsContext.tsx
│   └── AppProviders.tsx
├── hooks/              # Custom hooks
│   ├── useNetworkStatus.ts
│   └── useOfflineData.ts
├── services/           # API and data services
│   ├── api.ts
│   ├── queryClient.ts
│   └── offlineStorage.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── constants/          # App constants
│   └── index.ts
├── screens/            # Screen components
└── App.example.tsx     # Integration example
```

## 🔧 Key Features

### 1. Authentication System
- JWT token-based authentication
- Automatic token refresh
- Secure storage using AsyncStorage
- Login/logout/register functionality

### 2. Offline Support
- Course and lesson caching
- Progress tracking offline
- Automatic sync when back online
- Network status monitoring

### 3. State Management
- React Context for global state
- Auth state management
- App settings persistence
- Offline data management

### 4. Data Fetching
- React Query for server state
- Intelligent caching strategies
- Offline-first approach
- Error handling and retries

### 5. Network Management
- Real-time network status
- Offline mode toggle
- Connection type detection
- Sync status tracking

## 🚀 Getting Started

### Installation
All dependencies are already installed:

```bash
npm install
```

### Environment Variables
Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_URL=your_api_base_url_here
```

### Usage Example

1. **Wrap your app with providers:**

```tsx
import { AppProviders } from './src/contexts/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <YourAppContent />
    </AppProviders>
  );
}
```

2. **Use authentication:**

```tsx
import { useAuth } from './src/contexts/AuthContext';

function LoginScreen() {
  const { login, isLoading, user, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login(email, password);
      // User is now authenticated
    } catch (error) {
      // Handle login error
    }
  };
}
```

3. **Use network status:**

```tsx
import { useNetworkStatus } from './src/hooks/useNetworkStatus';

function NetworkBanner() {
  const { isOnline, networkStatus } = useNetworkStatus();
  
  return (
    <View>
      <Text>Status: {isOnline ? 'Online' : 'Offline'}</Text>
      <Text>Connection: {networkStatus.type}</Text>
    </View>
  );
}
```

4. **Use offline data:**

```tsx
import { useOfflineData } from './src/hooks/useOfflineData';

function CourseScreen({ courseId }) {
  const { saveForOffline, removeFromOffline, isCourseOffline } = useOfflineData();
  
  const handleDownloadCourse = async () => {
    await saveForOffline({ course, lessons });
  };
}
```

5. **Use settings:**

```tsx
import { useSettings } from './src/contexts/SettingsContext';

function SettingsScreen() {
  const { settings, updateSetting } = useSettings();
  
  const toggleTheme = () => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  };
}
```

## 🔧 API Service Usage

The API service handles authentication, retries, and error handling:

```tsx
import apiService from './src/services/api';

// GET request
const courses = await apiService.get('/courses');

// POST request
const newCourse = await apiService.post('/courses', courseData);

// Authentication is handled automatically
```

## 📱 Offline Functionality

### Course Download
- Download courses for offline viewing
- Store video files and resources locally
- Track download progress
- Manage storage space

### Progress Sync
- Track progress offline
- Queue progress updates
- Sync when connection restored
- Handle sync conflicts

### Network Detection
- Monitor connection status
- Handle connection changes
- Provide offline indicators
- Enable offline mode

## 🎯 TypeScript Integration

All components are fully typed with comprehensive interfaces:

```tsx
import { Course, Lesson, User, ApiResponse } from './src/types';

// Type-safe API calls
const response: ApiResponse<Course[]> = await apiService.get('/courses');

// Type-safe state
const [courses, setCourses] = useState<Course[]>([]);
```

## 🔐 Security Features

- Secure token storage
- Request/response interceptors
- Automatic token refresh
- Logout on token expiry
- Input validation
- Error handling

## 📊 Performance Optimizations

- React Query caching
- Lazy loading
- Image optimization
- Bundle splitting
- Memory management
- Background sync

## 🧪 Testing Ready

The architecture supports testing with:
- Unit tests for utilities
- Integration tests for hooks
- Component tests with React Testing Library
- E2E tests with Detox

## 📱 Platform Support

- iOS (React Native)
- Android (React Native)
- Web (Expo Web - limited offline features)

## 🔄 Sync Strategy

The app implements a robust sync strategy:

1. **Download Priority**: Critical content first
2. **Smart Sync**: Only sync changed data
3. **Conflict Resolution**: Last-write-wins with user notification
4. **Background Sync**: Sync in background when possible
5. **Error Recovery**: Retry failed syncs with exponential backoff

## 🚦 Error Handling

Comprehensive error handling for:
- Network errors
- Authentication failures
- Storage errors
- Sync failures
- API errors

## 📈 Monitoring

Built-in monitoring for:
- Network status changes
- Sync operations
- Storage usage
- App performance
- Error rates

## 🔧 Customization

The setup is highly customizable:
- Easy theme switching
- Configurable cache durations
- Adjustable retry policies
- Custom error handlers
- Extensible type system

This setup provides a solid foundation for building a robust, offline-capable learning app with modern React Native development practices.
