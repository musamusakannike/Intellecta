# Firebase Setup Guide for Kodr Mobile App

This guide will help you set up Firebase for Google and Apple authentication in the Kodr mobile app.

## Prerequisites

- A Google account
- An Apple Developer account (for Apple Sign In)
- Access to Firebase Console

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "Kodr" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Android App

1. In Firebase Console, click the Android icon
2. Enter package name: `com.kodr.app` (must match app.json)
3. Enter app nickname: "Kodr Android"
4. Click "Register app"
5. Download `google-services.json`
6. Place it in `mobile/android/app/` directory
7. Follow the Firebase SDK setup instructions (already done in the project)
8. Click "Continue to console"

## Step 3: Add iOS App

1. In Firebase Console, click the iOS icon
2. Enter bundle ID: `com.kodr.app` (must match app.json)
3. Enter app nickname: "Kodr iOS"
4. Click "Register app"
5. Download `GoogleService-Info.plist`
6. Place it in `mobile/ios/` directory
7. Follow the Firebase SDK setup instructions (already done in the project)
8. Click "Continue to console"

## Step 4: Enable Google Sign-In

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click on "Google"
3. Toggle "Enable"
4. Enter support email
5. Click "Save"

### Get Web Client ID

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Find the Web app section (or create one if it doesn't exist)
4. Copy the "Web client ID"
5. Update `mobile/src/services/auth.service.ts`:

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
});
```

### Add SHA-1 Fingerprint (Android)

For development:
```bash
cd mobile/android
./gradlew signingReport
```

Copy the SHA-1 fingerprint and add it to Firebase:
1. Go to Project settings → Your apps → Android app
2. Click "Add fingerprint"
3. Paste the SHA-1 fingerprint

For production, add the SHA-1 from your release keystore.

## Step 5: Enable Apple Sign-In (iOS Only)

### In Firebase Console

1. Go to "Authentication" → "Sign-in method"
2. Click on "Apple"
3. Toggle "Enable"
4. You'll need to configure Apple Developer account settings first

### In Apple Developer Console

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → Select your App ID
4. Enable "Sign In with Apple" capability
5. Click "Save"

### In Xcode (if building locally)

1. Open `mobile/ios/Kodr.xcworkspace` in Xcode
2. Select your project in the navigator
3. Select your target
4. Go to "Signing & Capabilities"
5. Click "+ Capability"
6. Add "Sign In with Apple"

### Complete Firebase Setup

1. In Firebase Console, under Apple sign-in settings:
2. Enter your Apple Team ID (found in Apple Developer account)
3. Click "Save"

## Step 6: Update Backend Configuration

The backend needs to verify Firebase tokens. Update your backend `.env`:

```env
# Firebase Admin SDK (optional, for token verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

To get these credentials:
1. In Firebase Console, go to Project settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values and add to `.env`

## Step 7: Test Authentication

### Test Google Sign-In

1. Run the app: `npm start`
2. Navigate to Login screen
3. Click "Continue with Google"
4. Select a Google account
5. Verify successful login

### Test Apple Sign-In (iOS only)

1. Run on iOS device or simulator (iOS 13+)
2. Navigate to Login screen
3. Click "Continue with Apple"
4. Complete Apple authentication
5. Verify successful login

## Troubleshooting

### Google Sign-In Issues

**Error: "DEVELOPER_ERROR"**
- Verify SHA-1 fingerprint is added to Firebase
- Check that package name matches exactly
- Ensure google-services.json is in the correct location

**Error: "SIGN_IN_CANCELLED"**
- User cancelled the sign-in flow
- This is normal behavior

**Error: "SIGN_IN_FAILED"**
- Check internet connection
- Verify Firebase configuration
- Check that Google Sign-In is enabled in Firebase Console

### Apple Sign-In Issues

**Error: "1000"**
- Apple Sign-In not configured in Apple Developer Console
- Capability not added in Xcode

**Error: "1001"**
- User cancelled the sign-in flow
- This is normal behavior

**Not working on simulator**
- Apple Sign-In requires iOS 13+
- Ensure you're using a compatible simulator

### General Issues

**Firebase not initialized**
- Verify google-services.json (Android) or GoogleService-Info.plist (iOS) is present
- Rebuild the app after adding configuration files

**Token verification fails on backend**
- Ensure Firebase Admin SDK is configured
- Check that project ID matches

## Security Best Practices

1. **Never commit Firebase config files to public repositories**
   - Add to .gitignore if needed
   - Use environment-specific configs

2. **Restrict API keys**
   - In Firebase Console, go to Google Cloud Console
   - Restrict API keys to specific apps and APIs

3. **Enable App Check** (recommended for production)
   - Protects your backend from abuse
   - Go to Firebase Console → App Check

4. **Monitor authentication**
   - Check Firebase Console → Authentication → Users
   - Monitor for suspicious activity

## Production Checklist

- [ ] Add production SHA-1 fingerprint (Android)
- [ ] Configure production bundle ID (iOS)
- [ ] Restrict API keys
- [ ] Enable App Check
- [ ] Test on physical devices
- [ ] Verify backend token validation
- [ ] Set up monitoring and alerts
- [ ] Update privacy policy with OAuth providers

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Firebase Console logs
3. Check app logs for detailed error messages
4. Consult the official documentation

For project-specific issues, contact the development team.
