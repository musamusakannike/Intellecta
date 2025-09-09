import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import lessonsService, { Lesson } from '../../../src/services/lessonsService';
import { useAuth } from '../../../src/contexts/AuthContext';

export default function TopicLessonsScreen() {
  const { id: topicId } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLessons = useCallback(async () => {
    try {
      setLoading(true);
      const lessonsData = await lessonsService.getLessonsByTopic(topicId!);
      console.log("Lessons data:", JSON.stringify(lessonsData, null, 2));
      setLessons(lessonsData);
    } catch (error) {
      console.error('Failed to load lessons:', error);
      Alert.alert('Error', 'Failed to load lessons. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [topicId]);

  useEffect(() => {
    if (topicId) {
      loadLessons();
    }
  }, [topicId, loadLessons]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLessons();
  };

  const handleLessonPress = (lesson: Lesson, index: number) => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please login to access lessons.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    if (!lesson.isEnrolled) {
      Alert.alert(
        'Enrollment Required',
        'You need to enroll in this course to access lessons.',
        [{ text: 'OK' }]
      );
      return;
    }


    // Check if the lesson is locked
    if (lesson.isLocked) {
      Alert.alert(
        'Lesson Locked',
        'You must complete the previous lesson to unlock this one.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to lesson details
    router.push(`/lesson/${lesson._id}`);
  };

  const getProgressColor = (progress?: { isCompleted: boolean; quizScore?: number | null } | null) => {
    if (!progress) return '#666';
    if (progress.isCompleted) {
      if (progress.quizScore !== undefined && progress.quizScore !== null) {
        return progress.quizScore >= 70 ? '#4CAF50' : '#FF9800';
      }
      return '#4CAF50';
    }
    return '#8B5FBF';
  };

  const renderLessonItem = ({ item, index }: { item: Lesson; index: number }) => {
    const progress = item.userProgress;
    const isCompleted = progress?.isCompleted || false;
    const isLocked = item.isLocked;
    const progressColor = getProgressColor(progress);

    return (
      <TouchableOpacity
        style={[styles.lessonCard, isLocked && styles.lockedCard]}
        onPress={() => handleLessonPress(item, index)}
        disabled={!item.isEnrolled}
      >
        <View style={styles.lessonHeader}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{item.order || index + 1}</Text>
          </View>
          
          <View style={styles.lessonInfo}>
            <Text style={[styles.lessonTitle, isLocked && styles.lockedText]}>
              {item.title}
            </Text>
            <Text style={[styles.lessonDescription, isLocked && styles.lockedText]}>
              {item.description}
            </Text>
          </View>

          <View style={styles.lessonStatus}>
            {isLocked ? (
              <Ionicons name="lock-closed" size={20} color="#666" />
            ) : isCompleted ? (
              <View style={[styles.statusBadge, { backgroundColor: progressColor }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: progressColor }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>

        {/* Progress and stats row */}
        <View style={styles.lessonStats}>
          {item.hasQuiz && (
            <View style={styles.statItem}>
              <Ionicons name="help-circle-outline" size={16} color="#8B5FBF" />
              <Text style={styles.statText}>Quiz</Text>
            </View>
          )}
          
          {progress?.quizScore !== undefined && progress.quizScore !== null && (
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={16} color={progress.quizScore >= 70 ? '#4CAF50' : '#FF9800'} />
              <Text style={[styles.statText, { color: progress.quizScore >= 70 ? '#4CAF50' : '#FF9800' }]}>
                {progress.quizScore}%
              </Text>
            </View>
          )}
        </View>

        {/* Progress bar for enrolled users */}
        {!isLocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: isCompleted ? '100%' : progress ? '50%' : '0%',
                    backgroundColor: progressColor
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {isCompleted ? 'Completed' : progress ? 'In Progress' : 'Not Started'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#666" />
      <Text style={styles.emptyTitle}>No Lessons Available</Text>
      <Text style={styles.emptySubtitle}>
        This topic doesn&apos;t have any lessons yet.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  const topicTitle = lessons.length > 0 ? lessons[0].topic.title : 'Topic Lessons';
  const courseTitle = lessons.length > 0 ? lessons[0].topic.course.title : '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{topicTitle}</Text>
          {courseTitle && (
            <Text style={styles.headerSubtitle}>{courseTitle}</Text>
          )}
        </View>
      </View>

      {/* Lessons List */}
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B5FBF"
            colors={['#8B5FBF']}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A1F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  lessonCard: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    borderColor: 'rgba(100, 100, 100, 0.3)',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5FBF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lessonInfo: {
    flex: 1,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  lockedText: {
    color: '#888888',
  },
  lessonStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
});
