import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register({ name, email, password });
      
      if (response.success && response.data) {
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Clear state anyway
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.getCurrentUser();
      const isAuthenticated = await authService.isAuthenticated();
      
      set({ 
        user, 
        isAuthenticated: isAuthenticated && !!user,
        isLoading: false 
      });
    } catch (error) {
      console.error('Load user error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));
