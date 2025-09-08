import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ApiError } from '../types';

// Create custom error handler
const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Query Error:', error.message);
  } else {
    console.error('Unknown Query Error:', error);
  }
};

// Create query cache with error handling
const queryCache = new QueryCache({
  onError: (error, query) => {
    console.error(`Query failed for key ${query.queryKey}:`, error);
    handleError(error);
  },
});

// Create mutation cache with error handling
const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    console.error('Mutation failed:', error);
    handleError(error);
  },
});

// Create the query client with optimized defaults for mobile
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // Stale time - data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Cache time - data stays in cache for 10 minutes after becoming unused
      gcTime: 10 * 60 * 1000,
      
      // Retry configuration for failed requests
      retry: (failureCount, error) => {
        // Don't retry for authentication errors
        if ((error as ApiError)?.status === 401) {
          return false;
        }
        
        // Don't retry for client errors (4xx)
        if ((error as ApiError)?.status >= 400 && (error as ApiError)?.status < 500) {
          return false;
        }
        
        // Retry up to 3 times for network errors and server errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus on mobile
      refetchOnWindowFocus: false,
      
      // Refetch on network reconnect
      refetchOnReconnect: 'always',
      
      // Network mode configuration for offline support
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

// Create persister for offline caching
export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_OFFLINE_CACHE',
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Network status utilities
export const getNetworkStatus = async () => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable ?? false,
    type: state.type,
  };
};

// Focus manager for mobile
export class MobileFocusManager {
  private listeners = new Set<() => void>();
  private isFocused = true;

  setFocused = (focused: boolean) => {
    if (this.isFocused !== focused) {
      this.isFocused = focused;
      this.listeners.forEach((listener) => listener());
    }
  };

  isFocused = () => {
    return this.isFocused;
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}

export const focusManager = new MobileFocusManager();

// Online manager for network status
export class MobileOnlineManager {
  private listeners = new Set<() => void>();
  private isOnline = true;

  constructor() {
    this.setupNetworkListener();
  }

  private setupNetworkListener = () => {
    NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected ?? false;
      this.setOnline(isOnline);
    });
  };

  setOnline = (online: boolean) => {
    if (this.isOnline !== online) {
      this.isOnline = online;
      this.listeners.forEach((listener) => listener());
    }
  };

  isOnline = () => {
    return this.isOnline;
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}

export const onlineManager = new MobileOnlineManager();

// Query key factories for consistent key generation
export const queryKeys = {
  all: ['courses'] as const,
  courses: () => [...queryKeys.all, 'course'] as const,
  course: (id: string) => [...queryKeys.courses(), id] as const,
  courseLessons: (courseId: string) => [...queryKeys.course(courseId), 'lessons'] as const,
  
  lessons: () => ['lessons'] as const,
  lesson: (id: string) => [...queryKeys.lessons(), id] as const,
  
  userProgress: () => ['userProgress'] as const,
  courseProgress: (courseId: string) => [...queryKeys.userProgress(), courseId] as const,
  
  user: () => ['user'] as const,
  userProfile: () => [...queryKeys.user(), 'profile'] as const,
  
  offline: () => ['offline'] as const,
  offlineCourses: () => [...queryKeys.offline(), 'courses'] as const,
  offlineLessons: () => [...queryKeys.offline(), 'lessons'] as const,
};
