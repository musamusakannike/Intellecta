import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Course, 
  Lesson, 
  UserProgress, 
  OfflineData, 
  SyncStatus, 
  CourseProgress 
} from '../types';

// Storage keys
const OFFLINE_DATA_KEY = 'offline_data';
const SYNC_STATUS_KEY = 'sync_status';
const OFFLINE_COURSES_KEY = 'offline_courses';
const OFFLINE_LESSONS_KEY = 'offline_lessons';
const USER_PROGRESS_KEY = 'user_progress';
const COURSE_PROGRESS_KEY = 'course_progress';

export class OfflineStorageService {
  // Sync Status Management
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      const statusStr = await AsyncStorage.getItem(SYNC_STATUS_KEY);
      if (statusStr) {
        return JSON.parse(statusStr);
      }
      
      // Default sync status
      return {
        isOnline: true,
        lastSyncAt: null,
        pendingSync: false,
        syncError: null,
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      throw error;
    }
  }

  async updateSyncStatus(status: Partial<SyncStatus>): Promise<void> {
    try {
      const currentStatus = await this.getSyncStatus();
      const updatedStatus = { ...currentStatus, ...status };
      await AsyncStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(updatedStatus));
    } catch (error) {
      console.error('Error updating sync status:', error);
      throw error;
    }
  }

  // Course Management
  async getOfflineCourses(): Promise<Course[]> {
    try {
      const coursesStr = await AsyncStorage.getItem(OFFLINE_COURSES_KEY);
      return coursesStr ? JSON.parse(coursesStr) : [];
    } catch (error) {
      console.error('Error getting offline courses:', error);
      return [];
    }
  }

  async saveOfflineCourse(course: Course): Promise<void> {
    try {
      const courses = await this.getOfflineCourses();
      const existingIndex = courses.findIndex(c => c.id === course.id);
      
      if (existingIndex >= 0) {
        courses[existingIndex] = course;
      } else {
        courses.push(course);
      }
      
      await AsyncStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving offline course:', error);
      throw error;
    }
  }

  async removeOfflineCourse(courseId: string): Promise<void> {
    try {
      const courses = await this.getOfflineCourses();
      const filteredCourses = courses.filter(c => c.id !== courseId);
      await AsyncStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify(filteredCourses));
      
      // Also remove associated lessons
      await this.removeOfflineLessonsForCourse(courseId);
    } catch (error) {
      console.error('Error removing offline course:', error);
      throw error;
    }
  }

  async isCourseAvailableOffline(courseId: string): Promise<boolean> {
    try {
      const courses = await this.getOfflineCourses();
      return courses.some(c => c.id === courseId);
    } catch (error) {
      console.error('Error checking offline course availability:', error);
      return false;
    }
  }

  // Lesson Management
  async getOfflineLessons(courseId?: string): Promise<Lesson[]> {
    try {
      const lessonsStr = await AsyncStorage.getItem(OFFLINE_LESSONS_KEY);
      const lessons: Lesson[] = lessonsStr ? JSON.parse(lessonsStr) : [];
      
      if (courseId) {
        return lessons.filter(l => l.courseId === courseId);
      }
      
      return lessons;
    } catch (error) {
      console.error('Error getting offline lessons:', error);
      return [];
    }
  }

  async saveOfflineLesson(lesson: Lesson): Promise<void> {
    try {
      const lessons = await this.getOfflineLessons();
      const existingIndex = lessons.findIndex(l => l.id === lesson.id);
      
      if (existingIndex >= 0) {
        lessons[existingIndex] = lesson;
      } else {
        lessons.push(lesson);
      }
      
      await AsyncStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(lessons));
    } catch (error) {
      console.error('Error saving offline lesson:', error);
      throw error;
    }
  }

  async removeOfflineLesson(lessonId: string): Promise<void> {
    try {
      const lessons = await this.getOfflineLessons();
      const filteredLessons = lessons.filter(l => l.id !== lessonId);
      await AsyncStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(filteredLessons));
    } catch (error) {
      console.error('Error removing offline lesson:', error);
      throw error;
    }
  }

  async removeOfflineLessonsForCourse(courseId: string): Promise<void> {
    try {
      const lessons = await this.getOfflineLessons();
      const filteredLessons = lessons.filter(l => l.courseId !== courseId);
      await AsyncStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(filteredLessons));
    } catch (error) {
      console.error('Error removing offline lessons for course:', error);
      throw error;
    }
  }

  async isLessonAvailableOffline(lessonId: string): Promise<boolean> {
    try {
      const lessons = await this.getOfflineLessons();
      return lessons.some(l => l.id === lessonId);
    } catch (error) {
      console.error('Error checking offline lesson availability:', error);
      return false;
    }
  }

  // Progress Management
  async getUserProgress(): Promise<UserProgress[]> {
    try {
      const progressStr = await AsyncStorage.getItem(USER_PROGRESS_KEY);
      return progressStr ? JSON.parse(progressStr) : [];
    } catch (error) {
      console.error('Error getting user progress:', error);
      return [];
    }
  }

  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const allProgress = await this.getUserProgress();
      const existingIndex = allProgress.findIndex(
        p => p.courseId === progress.courseId && p.lessonId === progress.lessonId
      );
      
      if (existingIndex >= 0) {
        allProgress[existingIndex] = progress;
      } else {
        allProgress.push(progress);
      }
      
      await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress));
      await this.updateCourseProgress(progress.courseId);
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  async getCourseProgress(courseId?: string): Promise<CourseProgress[]> {
    try {
      const progressStr = await AsyncStorage.getItem(COURSE_PROGRESS_KEY);
      const progress: CourseProgress[] = progressStr ? JSON.parse(progressStr) : [];
      
      if (courseId) {
        return progress.filter(p => p.courseId === courseId);
      }
      
      return progress;
    } catch (error) {
      console.error('Error getting course progress:', error);
      return [];
    }
  }

  private async updateCourseProgress(courseId: string): Promise<void> {
    try {
      const userProgress = await this.getUserProgress();
      const courseProgress = userProgress.filter(p => p.courseId === courseId);
      const lessons = await this.getOfflineLessons(courseId);
      
      const totalLessons = lessons.length;
      const completedLessons = courseProgress.length;
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      const lastWatched = courseProgress
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]?.completedAt;
      
      const newCourseProgress: CourseProgress = {
        courseId,
        totalLessons,
        completedLessons,
        progressPercentage,
        lastWatched,
      };
      
      const allCourseProgress = await this.getCourseProgress();
      const existingIndex = allCourseProgress.findIndex(p => p.courseId === courseId);
      
      if (existingIndex >= 0) {
        allCourseProgress[existingIndex] = newCourseProgress;
      } else {
        allCourseProgress.push(newCourseProgress);
      }
      
      await AsyncStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(allCourseProgress));
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  // Bulk Operations
  async saveOfflineData(data: Partial<OfflineData>): Promise<void> {
    try {
      const operations: Promise<void>[] = [];
      
      if (data.courses) {
        operations.push(AsyncStorage.setItem(OFFLINE_COURSES_KEY, JSON.stringify(data.courses)));
      }
      
      if (data.lessons) {
        operations.push(AsyncStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(data.lessons)));
      }
      
      if (data.progress) {
        operations.push(AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(data.progress)));
      }
      
      await Promise.all(operations);
      
      if (data.lastSyncAt) {
        await this.updateSyncStatus({ lastSyncAt: data.lastSyncAt });
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
      throw error;
    }
  }

  async getOfflineData(): Promise<OfflineData> {
    try {
      const [courses, lessons, progress] = await Promise.all([
        this.getOfflineCourses(),
        this.getOfflineLessons(),
        this.getUserProgress(),
      ]);
      
      const syncStatus = await this.getSyncStatus();
      
      return {
        courses,
        lessons,
        progress,
        lastSyncAt: syncStatus.lastSyncAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting offline data:', error);
      throw error;
    }
  }

  // Utility Methods
  async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        OFFLINE_COURSES_KEY,
        OFFLINE_LESSONS_KEY,
        USER_PROGRESS_KEY,
        COURSE_PROGRESS_KEY,
      ]);
      
      await this.updateSyncStatus({
        lastSyncAt: null,
        pendingSync: false,
        syncError: null,
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }

  async getStorageSize(): Promise<{ courses: number; lessons: number; progress: number; total: number }> {
    try {
      const [coursesStr, lessonsStr, progressStr] = await Promise.all([
        AsyncStorage.getItem(OFFLINE_COURSES_KEY),
        AsyncStorage.getItem(OFFLINE_LESSONS_KEY),
        AsyncStorage.getItem(USER_PROGRESS_KEY),
      ]);
      
      const courses = coursesStr ? JSON.stringify(coursesStr).length : 0;
      const lessons = lessonsStr ? JSON.stringify(lessonsStr).length : 0;
      const progress = progressStr ? JSON.stringify(progressStr).length : 0;
      
      return {
        courses,
        lessons,
        progress,
        total: courses + lessons + progress,
      };
    } catch (error) {
      console.error('Error getting storage size:', error);
      return { courses: 0, lessons: 0, progress: 0, total: 0 };
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();
