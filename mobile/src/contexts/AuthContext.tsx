import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { mockApiService } from '../services/mockApi';
import { User, AuthState } from '../types';

// Set to true for testing without backend, false for real API
const USE_MOCK_API = false;

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

// Auth context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOGIN_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USER_KEY = 'user_data';
const TOKEN_KEY = 'auth_token';

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [userData, token] = await Promise.all([
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(TOKEN_KEY),
      ]);

      if (userData && token) {
        const user: User = JSON.parse(userData);
        
        // Verify token is still valid by making a test request
        try {
          await apiService.get('/auth/verify');
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, token },
          });
        } catch (error) {
          // Token is invalid, clear stored data
          await clearStoredAuth();
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let response: any;
      
      if (USE_MOCK_API) {
        response = await mockApiService.login(email, password);
      } else {
        response = await apiService.post<{ user: User; token: string; refreshToken?: string }>('/auth/login', {
          email,
          password,
        });
      }

      console.log('Login response:', response); // Debug log
      
      // Handle different response structures
      let user: User;
      let token: string;
      let refreshToken: string | undefined;
      
      if (response.data) {
        console.log("Login response data:", JSON.stringify(response.data, null, 2))
        // If data is nested in response.data
        user = response.data.user;
        token = response.data.token;
        refreshToken = response.data.refreshToken;
      } else {
        console.log("Response: ", JSON.stringify(response, null, 2))
        // If data is at root level
        user = (response as any).user;
        token = (response as any).token;
        refreshToken = (response as any).refreshToken;
      }
      
      // Validate required fields
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      if (!user.id || !user.name || !user.email) {
        throw new Error('Invalid user data received from server');
      }

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
        apiService.setAuthToken(token),
        refreshToken ? apiService.setRefreshToken(refreshToken) : Promise.resolve(),
      ]);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      let response: any;
      
      if (USE_MOCK_API) {
        response = await mockApiService.register(name, email, password);
      } else {
        response = await apiService.post<{ user: User; token: string; refreshToken?: string }>('/auth/register', {
          name,
          email,
          password,
        });
      }

      console.log('Register response:', response); // Debug log
      
      // Handle different response structures
      let user: User;
      let token: string;
      let refreshToken: string | undefined;
      
      if (response.data) {
        // If data is nested in response.data
        user = response.data.user;
        token = response.data.token;
        refreshToken = response.data.refreshToken;
      } else {
        // If data is at root level
        user = (response as any).user;
        token = (response as any).token;
        refreshToken = (response as any).refreshToken;
      }
      
      // Validate required fields
      if (!user || !token) {
        throw new Error('Invalid response from server: missing user or token');
      }
      
      if (!user.id || !user.name || !user.email) {
        throw new Error('Invalid user data received from server');
      }

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
        apiService.setAuthToken(token),
        refreshToken ? apiService.setRefreshToken(refreshToken) : Promise.resolve(),
      ]);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      try {
        await apiService.post('/auth/logout');
      } catch (error) {
        // Ignore logout API errors
        console.warn('Logout API call failed:', error);
      }

      // Clear stored data
      await clearStoredAuth();
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still clear local data
      await clearStoredAuth();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await apiService.put<User>('/user/profile', userData);
      const updatedUser = response.data;
      
      // Update stored user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser,
      });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const clearStoredAuth = async (): Promise<void> => {
    await Promise.all([
      AsyncStorage.removeItem(USER_KEY),
      apiService.logout(),
    ]);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
