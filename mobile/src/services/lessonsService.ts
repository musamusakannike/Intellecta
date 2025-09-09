import apiService from "./api";

// Lesson content types (aligned with backend)
export interface LessonContent {
  type: "text" | "image" | "code" | "latex" | "link" | "video" | "youtubeUrl";
  content: any; // Mixed type as in backend
  order: number;
}

export interface LessonContentGroup {
  title: string;
  description?: string;
  contents: LessonContent[];
  order: number;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: number; // Only present for admins
  explanation?: string; // Only present for admins or after submission
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  topic: {
    _id: string;
    title: string;
    course: {
      _id: string;
      title: string;
    };
  };
  contentGroups: LessonContentGroup[];
  quiz?: LessonQuizQuestion[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Present when user is enrolled
  userProgress?: {
    lesson: string;
    isCompleted: boolean;
    completedAt?: string | null;
    quizScore?: number | null;
    timeSpent: number;
  } | null;
  isEnrolled?: boolean;
  hasQuiz?: boolean;
  quizQuestionCount?: number;
  isLocked: boolean;
}

export interface LessonProgress {
  lesson: string;
  isCompleted: boolean;
  completedAt?: string | null;
  timeSpent: number;
  quizScore?: number | null;
}

export interface TopicProgress {
  topic: string;
  progressPercentage: number;
  isCompleted: boolean;
}

export interface ProgressUpdateResponse {
  lessonProgress: LessonProgress;
  topicProgress: TopicProgress;
}

export interface QuizSubmissionResult {
  questionIndex: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizSubmissionResponse {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
  results: QuizSubmissionResult[];
}

class LessonsService {
  // Get all lessons for a topic
  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    const response = await apiService.get<{ lessons: Lesson[] }>(
      `/lessons/topic/${topicId}`
    );
    return response.data.lessons;
  }

  // Get lesson by ID with full content
  async getLessonById(lessonId: string): Promise<Lesson> {
    const response = await apiService.get<{ lesson: Lesson }>(
      `/lessons/${lessonId}`
    );
    return response.data.lesson;
  }

  // Mark lesson progress (completion, time spent)
  async markLessonProgress(
    lessonId: string,
    isCompleted: boolean,
    timeSpent?: number
  ): Promise<ProgressUpdateResponse> {
    const response = await apiService.patch<ProgressUpdateResponse>(
      `/lessons/${lessonId}/progress`,
      {
        isCompleted,
        timeSpent,
      }
    );
    return response.data;
  }

  // Submit quiz answers
  async submitQuiz(
    lessonId: string,
    answers: number[]
  ): Promise<QuizSubmissionResponse> {
    const response = await apiService.post<QuizSubmissionResponse>(
      `/lessons/${lessonId}/quiz/submit`,
      {
        answers,
      }
    );
    return response.data;
  }
}

const lessonsService = new LessonsService();
export default lessonsService;
