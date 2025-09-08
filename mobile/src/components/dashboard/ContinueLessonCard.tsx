import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CurrentProgress } from '../../services/dashboardService';

interface ContinueLessonCardProps {
  currentProgress: CurrentProgress | null;
  onPress?: () => void;
}

const ContinueLessonCard: React.FC<ContinueLessonCardProps> = ({ currentProgress, onPress }) => {
  if (!currentProgress) {
    return (
      <TouchableOpacity style={[styles.container, styles.emptyContainer]} onPress={onPress}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="book-outline" size={40} color="#8B5FBF" />
        </View>
        <Text style={styles.emptyTitle}>Start Learning</Text>
        <Text style={styles.emptySubtitle}>Explore courses and begin your coding journey</Text>
        <View style={styles.startButton}>
          <Text style={styles.startButtonText}>Browse Courses</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  }

  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Continue Lesson</Text>
          <Ionicons name="play-circle" size={24} color="#8B5FBF" />
        </View>

        <View style={styles.courseInfo}>
          {currentProgress.courseImage && (
            <Image source={{ uri: currentProgress.courseImage }} style={styles.courseImage} />
          )}
          <View style={styles.courseDetails}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {currentProgress.courseTitle}
            </Text>
            <Text style={styles.currentTopic} numberOfLines={1}>
              {currentProgress.currentTopic}
            </Text>
            <Text style={styles.lastAccessed}>
              Last accessed: {formatLastAccessed(currentProgress.lastAccessedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentProgress.completedTopics}/{currentProgress.totalTopics} topics completed
            </Text>
            <Text style={styles.progressPercentage}>
              {currentProgress.progressPercentage}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${currentProgress.progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B5FBF',
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  courseInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  currentTopic: {
    fontSize: 12,
    color: '#8B5FBF',
    marginBottom: 4,
  },
  lastAccessed: {
    fontSize: 10,
    color: '#888',
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5FBF',
    borderRadius: 3,
  },
  // Empty state styles
  emptyContainer: {
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ContinueLessonCard;
