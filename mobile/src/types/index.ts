// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification?: {
    email: string;
    name: string;
  } | null;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  price: number;
  rating: number;
  totalLessons: number;
  completedLessons: number;
  isOfflineAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  order: number;
  isCompleted: boolean;
  isOfflineAvailable: boolean;
  transcript?: string;
  resources: LessonResource[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonResource {
  id: string;
  type: 'pdf' | 'document' | 'link' | 'image';
  title: string;
  url: string;
  isOfflineAvailable: boolean;
}

// Progress types
export interface UserProgress {
  courseId: string;
  lessonId: string;
  userId: string;
  completedAt: string;
  watchTime: number; // in seconds
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastWatched?: string;
}

// Offline/Sync types
export interface OfflineData {
  courses: Course[];
  lessons: Lesson[];
  progress: UserProgress[];
  lastSyncAt: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string | null;
  pendingSync: boolean;
  syncError: string | null;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// App Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoDownload: boolean;
  videoQuality: 'low' | 'medium' | 'high' | 'auto';
  offlineOnly: boolean;
  notifications: {
    courseUpdates: boolean;
    reminders: boolean;
    promotions: boolean;
  };
}

// Auth verification types
export interface RegistrationResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    isPremium?: boolean;
    premiumExpiryDate?: string;
  };
  devVerificationCode?: string; // For development
}

export interface VerificationResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Navigation types
export interface TabScreens {
  Home: undefined;
  Courses: undefined;
  Downloads: undefined;
  Profile: undefined;
}

export interface StackScreens {
  CourseDetail: { courseId: string };
  LessonPlayer: { lessonId: string; courseId: string };
  Settings: undefined;
  Login: undefined;
  Register: undefined;
}
