// Core type definitions for Kodr app

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  verified: boolean;
  isPremium: boolean;
  premiumExpiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratingStats: {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<string, number>;
  };
  enrollmentCount: number;
  topicCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  _id: string;
  user: string;
  course: Course;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  isCompleted: boolean;
  progressPercentage: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  totalTimeSpent: number;
  lastAccessedAt: string;
}

export interface Topic {
  _id: string;
  title: string;
  description: string;
  course: string | Course;
  order: number;
  isActive: boolean;
  lessonCount: number;
  userProgress?: {
    topic: string;
    isCompleted: boolean;
    progressPercentage: number;
    lessonsProgress: LessonProgress[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  type: 'text' | 'image' | 'code' | 'latex' | 'link' | 'video' | 'youtubeUrl';
  content: string;
  order: number;
}

export interface ContentGroup {
  title: string;
  description?: string;
  order: number;
  contents: ContentItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  topic: string | Topic;
  order: number;
  isActive: boolean;
  contentGroups: ContentGroup[];
  quiz: QuizQuestion[];
  hasQuiz: boolean;
  quizQuestionCount: number;
  isEnrolled?: boolean;
  userProgress?: LessonProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LessonProgress {
  lesson: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  quizScore?: number;
}

export interface QuizSubmission {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  results: Array<{
    questionIndex: number;
    question: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface Question {
  _id: string;
  user: User;
  course: string | Course;
  title: string;
  content: string;
  tags: string[];
  answers: Answer[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  _id: string;
  user: User;
  question: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  user: User;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  user: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  transactionId: string;
  paymentMethod: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
