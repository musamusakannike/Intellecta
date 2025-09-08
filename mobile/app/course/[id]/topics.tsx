import React, { useState, useEffect } from 'react';
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
import coursesService, { CourseDetails } from '../../../src/services/coursesService';
import { useAuth } from '../../../src/contexts/AuthContext';

export default function CourseTopicsScreen() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await coursesService.getCourseById(courseId!);
      console.log("Course topics data:", JSON.stringify(courseData, null, 2));
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to load course:', error);
      Alert.alert('Error', 'Failed to load course. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCourse();
  };

  const handleTopicPress = (topicId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please login to access topics.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    if (!course?.enrollment) {
      Alert.alert(
        'Enrollment Required',
        'You need to enroll in this course to access topics.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to topic lessons
    router.push(`/topic/${topicId}/lessons`);
  };

  const getTopicProgress = (topicId: string) => {
    if (!course?.enrollment?.topicsProgress) return { progressPercentage: 0, isCompleted: false };
    
    const topicProgress = course.enrollment.topicsProgress.find(tp => tp.topic === topicId);
    return topicProgress || { progressPercentage: 0, isCompleted: false };
  };

  const renderTopicItem = ({ item, index }: { item: any; index: number }) => {
    const isEnrolled = !!course?.enrollment;
    const topicProgress = getTopicProgress(item._id);
    const isCompleted = topicProgress.isCompleted;
    const progressPercentage = topicProgress.progressPercentage;

    return (
      <TouchableOpacity
        style={[styles.topicCard, !isEnrolled && styles.lockedCard]}
        onPress={() => handleTopicPress(item._id)}
        disabled={!isEnrolled}
      >
        <View style={styles.topicHeader}>
          <View style={styles.topicNumber}>
            <Text style={styles.topicNumberText}>{item.order || index + 1}</Text>
          </View>
          
          <View style={styles.topicInfo}>
            <Text style={[styles.topicTitle, !isEnrolled && styles.lockedText]}>
              {item.title}
            </Text>
            <Text style={[styles.topicDescription, !isEnrolled && styles.lockedText]}>
              {item.description}
            </Text>
          </View>

          <View style={styles.topicStatus}>
            {!isEnrolled ? (
              <Ionicons name="lock-closed" size={20} color="#666" />
            ) : isCompleted ? (
              <View style={[styles.statusBadge, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            ) : progressPercentage > 0 ? (
              <View style={[styles.statusBadge, { backgroundColor: '#8B5FBF' }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: '#666' }]}>
                <Ionicons name="play" size={14} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>

        {/* Topic stats */}
        <View style={styles.topicStats}>
          {item.lessonCount !== undefined && (
            <View style={styles.statItem}>
              <Ionicons name="document-text-outline" size={16} color="#8B5FBF" />
              <Text style={styles.statText}>
                {item.lessonCount} lesson{item.lessonCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Progress bar for enrolled users */}
        {isEnrolled && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: isCompleted ? '#4CAF50' : '#8B5FBF'
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {isCompleted ? 'Completed' : progressPercentage > 0 ? `${progressPercentage}% Complete` : 'Not Started'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="library-outline" size={64} color="#666" />
      <Text style={styles.emptyTitle}>No Topics Available</Text>
      <Text style={styles.emptySubtitle}>
        This course doesn&apos;t have any topics yet.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Course Not Found</Text>
        <Text style={styles.errorText}>
          The course you&apos;re looking for doesn&apos;t exist or has been removed.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{course.title}</Text>
          <Text style={styles.headerSubtitle}>Topics</Text>
        </View>
      </View>

      {/* Enrollment Status */}
      {course.enrollment && (
        <View style={styles.enrollmentInfo}>
          <View style={styles.enrollmentStats}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.statText}>
                {course.enrollment.progressPercentage}% Complete
              </Text>
            </View>
            {course.enrollment.totalTimeSpent > 0 && (
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#8B5FBF" />
                <Text style={styles.statText}>
                  {Math.round(course.enrollment.totalTimeSpent / 60)}h studied
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Topics List */}
      <FlatList
        data={course.topics || []}
        keyExtractor={(item) => item._id}
        renderItem={renderTopicItem}
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
  enrollmentInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  enrollmentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  topicCard: {
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
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  topicNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5FBF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topicInfo: {
    flex: 1,
    marginRight: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  lockedText: {
    color: '#888888',
  },
  topicStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
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
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  separator: {
    height: 16,
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
