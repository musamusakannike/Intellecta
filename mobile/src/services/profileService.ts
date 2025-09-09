import apiService from './api';

export interface ProfileStats {
  xp: number;
  completedCourses: number;
  streakDays: number;
  totalLessons: number;
  studyTime: number; // in minutes
  rank: number;
}

export interface UserLevel {
  current: number;
  name: string;
  xpRequired: number;
  xpCurrent: number;
  progress: number; // 0-100
  color: string; // Color for the glowing ring
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'completion' | 'social' | 'special';
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: number; // 0-100 for progress-based achievements
  requirement?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  completedAt: string;
  certificateUrl: string;
  grade?: string;
  skills: string[];
  thumbnail: string;
}

export interface ProfileData {
  stats: ProfileStats;
  level: UserLevel;
  achievements: Achievement[];
  certificates: Certificate[];
}

class ProfileService {
  async getProfileData(): Promise<ProfileData> {
    try {
      const response = await apiService.get<ProfileData>('/users/profile-data');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // Return mock data for development
      return this.getMockProfileData();
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiService.get<Achievement[]>('/users/achievements');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return [];
    }
  }

  async getCertificates(): Promise<Certificate[]> {
    try {
      const response = await apiService.get<Certificate[]>('/users/certificates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      return [];
    }
  }

  private getMockProfileData(): ProfileData {
    return {
      stats: {
        xp: 2450,
        completedCourses: 3,
        streakDays: 7,
        totalLessons: 45,
        studyTime: 180, // 3 hours
        rank: 12,
      },
      level: {
        current: 3,
        name: 'Code Explorer',
        xpRequired: 3000,
        xpCurrent: 2450,
        progress: 82, // (2450/3000) * 100
        color: '#06B6D4', // Cyan for level 3
      },
      achievements: [
        {
          id: '1',
          title: 'First Steps',
          description: 'Complete your first lesson',
          icon: 'footsteps',
          category: 'learning',
          isUnlocked: true,
          unlockedAt: '2024-01-15T10:30:00Z',
          rarity: 'common',
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: 'flame',
          category: 'streak',
          isUnlocked: true,
          unlockedAt: '2024-01-22T09:15:00Z',
          rarity: 'rare',
        },
        {
          id: '3',
          title: 'Course Crusher',
          description: 'Complete 5 courses',
          icon: 'trophy',
          category: 'completion',
          isUnlocked: false,
          progress: 60, // 3/5 courses
          requirement: '2 more courses to unlock',
          rarity: 'epic',
        },
        {
          id: '4',
          title: 'Night Owl',
          description: 'Study after 10 PM for 5 days',
          icon: 'moon',
          category: 'special',
          isUnlocked: false,
          progress: 20, // 1/5 days
          requirement: '4 more late-night sessions',
          rarity: 'rare',
        },
        {
          id: '5',
          title: 'Knowledge Seeker',
          description: 'Earn 5000 XP',
          icon: 'star',
          category: 'learning',
          isUnlocked: false,
          progress: 49, // 2450/5000
          requirement: '2550 XP to go',
          rarity: 'legendary',
        },
      ],
      certificates: [
        {
          id: '1',
          courseId: 'course-1',
          courseName: 'Introduction to React Native',
          instructorName: 'Sarah Johnson',
          completedAt: '2024-01-20T14:30:00Z',
          certificateUrl: 'https://example.com/certificates/1',
          grade: 'A+',
          skills: ['React Native', 'JavaScript', 'Mobile Development'],
          thumbnail: 'https://example.com/course-thumbnails/react-native.jpg',
        },
        {
          id: '2',
          courseId: 'course-2',
          courseName: 'JavaScript Fundamentals',
          instructorName: 'Mike Davis',
          completedAt: '2024-01-10T16:45:00Z',
          certificateUrl: 'https://example.com/certificates/2',
          grade: 'A',
          skills: ['JavaScript', 'ES6+', 'DOM Manipulation'],
          thumbnail: 'https://example.com/course-thumbnails/javascript.jpg',
        },
        {
          id: '3',
          courseId: 'course-3',
          courseName: 'CSS Advanced Techniques',
          instructorName: 'Emma Wilson',
          completedAt: '2024-01-05T11:20:00Z',
          certificateUrl: 'https://example.com/certificates/3',
          grade: 'B+',
          skills: ['CSS', 'Flexbox', 'Grid', 'Animations'],
          thumbnail: 'https://example.com/course-thumbnails/css.jpg',
        },
      ],
    };
  }

  // Level calculation utilities
  getLevelColor(level: number): string {
    const colors = [
      '#6B7280', // Level 0-1: Gray
      '#8B5FBF', // Level 2-3: Purple
      '#06B6D4', // Level 4-5: Cyan
      '#10B981', // Level 6-7: Green
      '#F59E0B', // Level 8-9: Yellow
      '#EF4444', // Level 10-11: Red
      '#8B5CF6', // Level 12-13: Violet
      '#FF6B6B', // Level 14-15: Pink
      '#FFD700', // Level 16+: Gold
    ];
    
    const colorIndex = Math.min(Math.floor(level / 2), colors.length - 1);
    return colors[colorIndex];
  }

  getLevelName(level: number): string {
    const names = [
      'Newbie',
      'Beginner',
      'Code Explorer',
      'Junior Dev',
      'Developer',
      'Senior Dev',
      'Tech Lead',
      'Architect',
      'Master',
      'Legend',
    ];
    
    const nameIndex = Math.min(Math.floor(level / 2), names.length - 1);
    return names[nameIndex];
  }

  calculateXPForNextLevel(currentLevel: number): number {
    // XP required increases exponentially
    return Math.floor(1000 * Math.pow(1.5, currentLevel));
  }
}

export default new ProfileService();
