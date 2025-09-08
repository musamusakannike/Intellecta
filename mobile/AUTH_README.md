# 🔐 Intellecta Mobile Authentication System

A complete authentication system with glassmorphism design, seamlessly integrated with the backend API and offline functionality.

## 🎨 Design Features

### Glassmorphism UI
- **Semi-transparent input fields** with purple blur glow
- **Floating background orbs** with animated movement
- **Glassmorphic buttons** with gradient overlays
- **Social login icons** in glowing orbs
- **Consistent color scheme** matching the onboarding

### Visual Elements
- **Primary Colors**: `#8B5FBF` (Purple), `#FF6B9D` (Pink)
- **Background**: `#100A1F` (Dark)
- **Blur Effects**: Using `expo-blur` with intensity 20
- **Animations**: React Native Reanimated with smooth transitions
- **Typography**: SpaceGrotesk font family

## 📱 Screen Flow

```
App Launch
    ↓
Index (Route Handler)
    ↓
┌─ First Time? → Onboarding → Welcome
│
└─ Returning User
    ├─ Authenticated → Main App (Tabs)
    └─ Not Authenticated → Welcome
```

### Authentication Screens
1. **Welcome Screen** (`/auth/welcome`)
   - Brand introduction
   - Sign In / Create Account buttons
   - Social login options (Google, Apple, GitHub)

2. **Login Screen** (`/auth/login`)
   - Email and password inputs
   - Form validation
   - Forgot password link
   - Account creation link

3. **Register Screen** (`/auth/register`)
   - Name, email, password, confirm password
   - Strong password validation
   - Terms & Privacy links
   - Login redirect

4. **Forgot Password** (`/auth/forgot-password`)
   - Email input for reset
   - Success confirmation screen
   - Back to login navigation

## 🔧 Technical Implementation

### Authentication Context
```typescript
const { 
  user,           // Current user object
  isAuthenticated, // Auth status
  isLoading,      // Loading state
  login,          // Login function
  logout,         // Logout function  
  register        // Registration function
} = useAuth();
```

### API Integration
- **Axios interceptors** for automatic token handling
- **JWT token refresh** mechanism
- **Secure storage** with AsyncStorage
- **Error handling** with user-friendly messages

### Form Validation
- **Email validation** with regex
- **Password strength** requirements
- **Real-time error display**
- **Loading states** during submission

### Offline Support
- **Token persistence** across app sessions
- **Network status** monitoring
- **Graceful error handling** when offline

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Update with your backend API URL
EXPO_PUBLIC_API_URL=http://your-backend-url/api
```

### 2. Backend Requirements
Your backend should provide these endpoints:

```typescript
// Authentication Endpoints
POST /auth/login      // { email, password }
POST /auth/register   // { name, email, password }
POST /auth/logout     // With Authorization header
POST /auth/refresh    // { refreshToken }
GET  /auth/verify     // Token verification

// Password Reset
POST /auth/forgot-password  // { email }
```

### 3. Response Format
Expected API response format:

```typescript
// Success Response
{
  "data": {
    "user": {
      "id": "string",
      "name": "string", 
      "email": "string",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "Success message",
  "success": true,
  "timestamp": "ISO_string"
}

// Error Response  
{
  "message": "Error description",
  "status": 400,
  "code": "ERROR_CODE"
}
```

## 🎯 Usage Examples

### Basic Authentication
```typescript
// Login
try {
  await login('user@example.com', 'password123');
  router.replace('/(tabs)'); // Navigate to main app
} catch (error) {
  Alert.alert('Login Failed', error.message);
}

// Register
try {
  await register('John Doe', 'john@example.com', 'password123');
  router.replace('/(tabs)'); // Navigate to main app
} catch (error) {
  Alert.alert('Registration Failed', error.message);
}

// Logout
await logout();
router.replace('/auth/welcome');
```

### Protected Routes
```typescript
// Check authentication in components
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingScreen />;
if (!isAuthenticated) return <LoginScreen />;

return <ProtectedContent />;
```

### Network Status Integration
```typescript
const { isOnline } = useNetworkStatus();
const { syncStatus } = useOfflineData();

// Show offline indicators
if (!isOnline) {
  return <OfflineBanner />;
}
```

## 🔧 Customization

### Styling
Update colors in the auth screens by modifying:
- Primary color: `#8B5FBF`
- Secondary color: `#FF6B9D` 
- Background: `#100A1F`
- Text colors in StyleSheet objects

### Social Login
Implement social authentication in `welcome.tsx`:
```typescript
const handleSocialLogin = async (provider: string) => {
  try {
    // Implement OAuth flow for each provider
    const result = await authenticateWithProvider(provider);
    await login(result.email, result.token);
  } catch (error) {
    Alert.alert('Social Login Failed', error.message);
  }
};
```

### Form Validation
Extend validation rules in utils:
```typescript
// Add custom validation
export const validateCustomField = (value: string): boolean => {
  // Your validation logic
  return value.length > 0;
};
```

## 📦 Dependencies

### Required Packages
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/netinfo` - Network status  
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching
- `expo-blur` - Blur effects
- `expo-linear-gradient` - Gradients
- `react-native-reanimated` - Animations
- `expo-router` - Navigation

### Architecture
- **Context API** for state management
- **TypeScript** for type safety
- **Custom hooks** for reusable logic
- **Animated components** for smooth UX
- **Modular structure** for maintainability

## 🐛 Troubleshooting

### Common Issues

1. **Network Errors**
   - Check API URL in `.env` file
   - Verify backend is running
   - Check device/emulator network connection

2. **Token Issues**
   - Clear AsyncStorage: Clear app data
   - Check token expiration handling
   - Verify refresh token flow

3. **Styling Issues**
   - Ensure fonts are loaded properly
   - Check blur view compatibility
   - Verify gradient colors

### Development Tips
- Use `console.log` for debugging auth flow
- Test with both online/offline scenarios  
- Validate forms with edge cases
- Test token refresh mechanism

## 🚀 Next Steps

After authentication is working:

1. **Implement main app features**
   - Course browsing and enrollment
   - Lesson video player
   - Progress tracking
   - User profile management

2. **Add advanced features**
   - Push notifications
   - Social sharing
   - In-app purchases
   - Advanced analytics

3. **Optimize performance**
   - Image caching
   - API response caching
   - Background sync
   - Memory management

The authentication system is now ready for your learning platform! 🎓
