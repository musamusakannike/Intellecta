# Kodr Mobile App

A beautiful, modern mobile application for learning to code, built with React Native and Expo.

## 🎨 Design Features

- **Purple Space Theme**: Unique cosmic design with deep purples and space-inspired aesthetics
- **DM Sans Font**: Clean, modern typography perfect for educational content
- **Smooth Animations**: Powered by React Native Reanimated for buttery smooth transitions
- **Haptic Feedback**: Tactile responses for better user experience
- **Toast Notifications**: Beautiful, animated toast messages with blur effects

## 🚀 Features

### Authentication
- ✅ Email/Password registration and login
- ✅ Email verification with 6-digit code
- ✅ Google OAuth integration
- ✅ Apple Sign In (iOS only)
- ✅ Forgot/Reset password functionality
- ✅ JWT token management with auto-refresh

### Core Features (In Progress)
- 📚 Browse and enroll in coding courses
- 📖 Interactive lessons with multiple content types
- ✅ Quiz system with instant feedback
- 💬 Community Q&A forum
- 🎯 Project showcase
- 👤 User profiles and progress tracking
- 💳 Premium subscription with Flutterwave

## 📱 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Animations**: React Native Reanimated 4
- **Styling**: StyleSheet with design tokens
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth (Google & Apple)
- **Storage**: AsyncStorage
- **Icons**: Lucide React Native
- **Fonts**: DM Sans (Google Fonts)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio
- Expo Go app on your physical device (optional)

### Installation

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Firebase (for OAuth)**
   
   Create a Firebase project at https://console.firebase.google.com
   
   - Enable Google Sign-In in Authentication
   - Enable Apple Sign-In in Authentication (iOS only)
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in the appropriate directories

3. **Update Firebase Configuration**
   
   In `src/services/auth.service.ts`, update the Google Web Client ID:
   ```typescript
   GoogleSignin.configure({
     webClientId: 'YOUR_WEB_CLIENT_ID', // From Firebase Console
   });
   ```

4. **Configure Backend URL**
   
   In `src/config/api.ts`, update the BASE_URL if needed:
   ```typescript
   BASE_URL: __DEV__ 
     ? 'http://localhost:5000/api'  // For local development
     : 'https://api.kodr.app/api',  // For production
   ```

### Running the App

#### Development Mode

```bash
# Start the development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on web
npm run web
```

#### Using Expo Go

1. Start the dev server: `npm start`
2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📁 Project Structure

```
mobile/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verify-email.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── index.tsx        # Home/Dashboard
│   │   ├── courses.tsx      # Courses list
│   │   ├── community.tsx    # Q&A Community
│   │   ├── projects.tsx     # Projects showcase
│   │   └── profile.tsx      # User profile
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── src/
│   ├── components/          # Reusable components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Toast.tsx
│   │   └── ToastProvider.tsx
│   ├── config/              # Configuration
│   │   └── api.ts
│   ├── constants/           # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── services/            # API services
│   │   ├── api.service.ts
│   │   └── auth.service.ts
│   ├── store/               # State management
│   │   └── authStore.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── assets/                  # Images, fonts, etc.
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## 🎨 Design System

### Colors

The app uses a purple space theme with the following color palette:

- **Primary**: Purple shades (#8B5CF6)
- **Secondary**: Magenta shades (#D946EF)
- **Background**: Deep space blacks (#0A0118, #130828)
- **Surface**: Elevated surfaces (#1A0F2E, #251A3A)
- **Text**: White with varying opacities

### Typography

- **Font Family**: DM Sans
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Sizes**: xs (12px) to 5xl (48px)

### Spacing

Consistent spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), xxl (48px), xxxl (64px)

## 🔐 Environment Variables

Create a `.env` file in the mobile directory (if needed):

```env
# API Configuration
API_BASE_URL=http://localhost:5000/api

# Firebase (if using config file instead of google-services.json)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 API Integration

The app connects to the Kodr backend API. Ensure the backend is running:

```bash
cd ../backend
npm run dev
```

Backend should be running on `http://localhost:5000`

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npx expo start -c
   ```

2. **iOS build fails**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails**
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Firebase authentication not working**
   - Verify Firebase configuration files are in place
   - Check that OAuth providers are enabled in Firebase Console
   - Ensure SHA-1 fingerprint is added for Android

## 📄 License

This project is part of the Kodr learning platform.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For support, email support@kodr.app or open an issue in the repository.
