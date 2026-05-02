// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://172.20.10.3:5000/api' 
    : 'https://api.kodr.app/api',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_CODE: '/auth/resend-code',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  
  // User
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    PROFILE_PICTURE: '/users/profile-picture',
    EXPO_TOKEN: '/users/expo-token',
    DELETE_ACCOUNT: '/users/account',
    PREMIUM_ACCESS: '/users/premium/access',
    PREMIUM_FEATURES: '/users/premium/features',
  },
  
  // Courses
  COURSES: {
    LIST: '/courses',
    SEARCH: '/courses/search',
    DETAIL: (id: string) => `/courses/${id}`,
    ENROLL: (id: string) => `/courses/${id}/enroll`,
    MY_ENROLLMENTS: '/courses/enrollments/my',
  },
  
  // Topics
  TOPICS: {
    BY_COURSE: (courseId: string) => `/topics/course/${courseId}`,
    DETAIL: (id: string) => `/topics/${id}`,
  },
  
  // Lessons
  LESSONS: {
    BY_TOPIC: (topicId: string) => `/lessons/topic/${topicId}`,
    DETAIL: (id: string) => `/lessons/${id}`,
    SUBMIT_QUIZ: (id: string) => `/lessons/${id}/quiz/submit`,
    UPDATE_PROGRESS: (id: string) => `/lessons/${id}/progress`,
  },
  
  // Q&A
  QA: {
    QUESTIONS: '/qa/questions',
    QUESTION_DETAIL: (id: string) => `/qa/questions/${id}`,
    CREATE_ANSWER: (id: string) => `/qa/questions/${id}/answers`,
    VOTE_ANSWER: (id: string) => `/qa/answers/${id}/vote`,
  },
  
  // Projects
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    INITIATE: '/payments/premium/initiate',
    VERIFY: '/payments/verify',
    STATUS: '/payments/premium/status',
    HISTORY: '/payments/history',
    CANCEL: (id: string) => `/payments/cancel/${id}`,
  },
};
