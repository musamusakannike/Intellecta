import apiService from './api';
import { ApiResponse } from '../types';

// Dashboard types
export interface DashboardUser {
  name: string;
  profilePicture?: { url?: string };
  isPremium: boolean;
}

export interface CurrentProgress {
  courseTitle: string;
  courseImage?: string;
  progressPercentage: number;
  currentTopic: string;
  totalTopics: number;
  completedTopics: number;
  lastAccessedAt: string;
}

export interface DailyChallenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  status: {
    attempted: boolean;
    completed: boolean;
    pointsEarned: number;
  };
}

export interface LeaderboardData {
  userRank: number;
  userPoints: number;
  userLevel: number;
  streakDays: number;
  topUsers: Array<{
    rank: number;
    name: string;
    profilePicture?: { url?: string };
    points: number;
    level: number;
  }>;
}

export interface CommunityPick {
  _id: string;
  title: string;
  description: string;
  image?: string;
  rating: number;
  totalRatings: number;
  categories: string[];
}

export interface DashboardData {
  user: DashboardUser;
  currentProgress: CurrentProgress | null;
  dailyChallenge: DailyChallenge | null;
  leaderboard: LeaderboardData;
  communityPicks: CommunityPick[];
}

export interface RecentActivity {
  type: 'course' | 'challenge';
  action: string;
  title: string;
  image?: string;
  difficulty?: string;
  progress?: number;
  timestamp: string;
  points: number;
}

export interface ProgressStats {
  courses: {
    total: number;
    completed: number;
    inProgress: number;
    averageProgress: number;
  };
  challenges: {
    total: number;
    completed: number;
    completionRate: number;
  };
  timeSpent: {
    total: number;
    totalHours: number;
    averagePerCourse: number;
  };
  points: {
    total: number;
    challengePoints: number;
    coursePoints: number;
    level: number;
    experiencePoints: number;
  };
  streak: {
    current: number;
    longest: number;
  };
}

class DashboardService {
  async getDashboardOverview(): Promise<DashboardData> {
    const response = await apiService.get<DashboardData>('/dashboard');
    return response.data;
  }

  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await apiService.get<{ activities: RecentActivity[] }>(`/dashboard/activity?limit=${limit}`);
    return response.data.activities;
  }

  async getProgressStats(): Promise<ProgressStats> {
    const response = await apiService.get<ProgressStats>('/dashboard/stats');
    return response.data;
  }

  async getChallengeDetails(challengeId: string): Promise<any> {
    const response = await apiService.get(`/dashboard/challenge/${challengeId}`);
    return response.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
