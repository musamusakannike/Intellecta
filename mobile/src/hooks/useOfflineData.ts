import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offlineStorage } from '../services/offlineStorage';
import { useNetworkStatus } from './useNetworkStatus';
import { Course, Lesson, UserProgress, OfflineData, SyncStatus } from '../types';
import { queryKeys } from '../services/queryClient';

export const useOfflineData = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSyncAt: null,
    pendingSync: false,
    syncError: null,
  });

  // Get offline data
  const {
    data: offlineData,
    isLoading: isLoadingOfflineData,
    refetch: refetchOfflineData,
  } = useQuery({
    queryKey: queryKeys.offline(),
    queryFn: () => offlineStorage.getOfflineData(),
    staleTime: 0, // Always refetch when called
  });

  // Get sync status
  const { data: currentSyncStatus, refetch: refetchSyncStatus } = useQuery({
    queryKey: ['syncStatus'],
    queryFn: () => offlineStorage.getSyncStatus(),
    onSuccess: (data) => setSyncStatus(data),
  });

  // Sync offline data mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      // This would sync with your backend API
      // For now, just update the last sync time
      const now = new Date().toISOString();
      await offlineStorage.updateSyncStatus({
        lastSyncAt: now,
        pendingSync: false,
        syncError: null,
      });
      return now;
    },
    onSuccess: () => {
      refetchSyncStatus();
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    onError: (error) => {
      offlineStorage.updateSyncStatus({
        syncError: error instanceof Error ? error.message : 'Sync failed',
        pendingSync: false,
      });
    },
  });

  // Save course for offline use
  const saveForOffline = useMutation({
    mutationFn: async ({ course, lessons }: { course: Course; lessons: Lesson[] }) => {
      await offlineStorage.saveOfflineCourse({
        ...course,
        isOfflineAvailable: true,
      });

      for (const lesson of lessons) {
        await offlineStorage.saveOfflineLesson({
          ...lesson,
          isOfflineAvailable: true,
        });
      }
    },
    onSuccess: () => {
      refetchOfflineData();
      queryClient.invalidateQueries({ queryKey: queryKeys.offlineCourses() });
    },
  });

  // Remove course from offline storage
  const removeFromOffline = useMutation({
    mutationFn: async (courseId: string) => {
      await offlineStorage.removeOfflineCourse(courseId);
    },
    onSuccess: () => {
      refetchOfflineData();
      queryClient.invalidateQueries({ queryKey: queryKeys.offlineCourses() });
    },
  });

  // Save user progress
  const saveProgress = useMutation({
    mutationFn: async (progress: UserProgress) => {
      await offlineStorage.saveUserProgress(progress);
      
      // Mark as pending sync if offline
      if (!isOnline) {
        await offlineStorage.updateSyncStatus({ pendingSync: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProgress() });
      refetchOfflineData();
    },
  });

  // Check if course is available offline
  const isCourseOffline = useCallback(
    async (courseId: string): Promise<boolean> => {
      return await offlineStorage.isCourseAvailableOffline(courseId);
    },
    []
  );

  // Check if lesson is available offline
  const isLessonOffline = useCallback(
    async (lessonId: string): Promise<boolean> => {
      return await offlineStorage.isLessonAvailableOffline(lessonId);
    },
    []
  );

  // Get offline courses
  const getOfflineCourses = useCallback(async (): Promise<Course[]> => {
    return await offlineStorage.getOfflineCourses();
  }, []);

  // Get offline lessons
  const getOfflineLessons = useCallback(
    async (courseId?: string): Promise<Lesson[]> => {
      return await offlineStorage.getOfflineLessons(courseId);
    },
    []
  );

  // Clear all offline data
  const clearOfflineData = useMutation({
    mutationFn: async () => {
      await offlineStorage.clearOfflineData();
    },
    onSuccess: () => {
      refetchOfflineData();
      refetchSyncStatus();
      queryClient.invalidateQueries({ queryKey: queryKeys.offline() });
    },
  });

  // Get storage size info
  const getStorageInfo = useCallback(async () => {
    return await offlineStorage.getStorageSize();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && syncStatus.pendingSync && !syncMutation.isPending) {
      syncMutation.mutate();
    }
  }, [isOnline, syncStatus.pendingSync, syncMutation]);

  return {
    // Data
    offlineData,
    syncStatus: currentSyncStatus || syncStatus,
    
    // Loading states
    isLoadingOfflineData,
    isSyncing: syncMutation.isPending,
    isSaving: saveForOffline.isPending,
    isRemoving: removeFromOffline.isPending,
    isSavingProgress: saveProgress.isPending,
    isClearing: clearOfflineData.isPending,
    
    // Actions
    sync: syncMutation.mutate,
    saveForOffline: saveForOffline.mutate,
    removeFromOffline: removeFromOffline.mutate,
    saveProgress: saveProgress.mutate,
    clearOfflineData: clearOfflineData.mutate,
    
    // Utilities
    isCourseOffline,
    isLessonOffline,
    getOfflineCourses,
    getOfflineLessons,
    getStorageInfo,
    refetchOfflineData,
    
    // Errors
    syncError: syncMutation.error,
    saveError: saveForOffline.error,
    removeError: removeFromOffline.error,
    progressError: saveProgress.error,
    clearError: clearOfflineData.error,
  };
};
