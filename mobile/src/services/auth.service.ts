import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';
import { AuthResponse, User } from '../types';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  expoPushToken?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse['data']>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Do NOT save auth data here — the backend doesn't issue tokens at registration.
    // Tokens are only returned after email verification (verifyEmail).
    
    return response as AuthResponse;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse['data']>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    
    if (response.success && response.data) {
      await this.saveAuthData(response.data.token, response.data.refreshToken, response.data.user);
    }
    
    return response as AuthResponse;
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email, code });
  }

  async resendCode(email: string): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.RESEND_CODE, { email });
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem('accessToken');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  private async saveAuthData(
    accessToken: string,
    refreshToken: string | undefined,
    user: User
  ): Promise<void> {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken || ''],
      ['user', JSON.stringify(user)],
    ]);
  }

  private async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  }

  // Google Sign In
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Configure Google Sign In
      // webClientId: the Web client ID from Firebase Console → Authentication → Sign-in method → Google
      // It looks like: 384254940125-xxxx.apps.googleusercontent.com (client_type: 3 in google-services.json)
      GoogleSignin.configure({
        webClientId: '384254940125-e6c5krituqm1borampq3curg4uumhfjg.apps.googleusercontent.com',
      });

      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      // Get the Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();

      // Send to your backend for verification and user creation
      const response = await apiService.post<AuthResponse['data']>(
        '/auth/google',
        { idToken: firebaseToken }
      );

      if (response.success && response.data) {
        await this.saveAuthData(response.data.token, response.data.refreshToken, response.data.user);
      }

      return response as AuthResponse;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Apple Sign In
  async signInWithApple(): Promise<AuthResponse> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Create an Apple credential with the token
      const { identityToken } = credential;
      if (!identityToken) {
        throw new Error('No identity token received');
      }

      const appleCredential = auth.AppleAuthProvider.credential(identityToken);

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(appleCredential);
      
      // Get the Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();

      // Send to your backend
      const response = await apiService.post<AuthResponse['data']>(
        '/auth/apple',
        { 
          idToken: firebaseToken,
          fullName: credential.fullName,
        }
      );

      if (response.success && response.data) {
        await this.saveAuthData(response.data.token, response.data.refreshToken, response.data.user);
      }

      return response as AuthResponse;
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  }

  // Forgot Password - Request reset code
  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  }

  // Reset Password with code
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email, code, newPassword });
  }
}

export const authService = new AuthService();
