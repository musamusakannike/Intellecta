import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import coursesService, { CourseDetails } from '../../src/services/coursesService';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseDetails();
    }
  }, [id]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      const courseData = await coursesService.getCourseById(id!);
      console.log("Course data:", JSON.stringify(courseData, null, 2));
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to load course details:', error);
      Alert.alert('Error', 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);
      await coursesService.enrollInCourse(course._id);
      Alert.alert(
        'Success!',
        'You have successfully enrolled in this course.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      Alert.alert(
        'Enrollment Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setEnrolling(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#555" />
      );
    }

    return stars;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5FBF" />
        <Text style={styles.loadingText}>Loading course details...</Text>
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
        <Text style={styles.headerTitle}>Course Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        <View style={styles.imageContainer}>
          {course.image ? (
            <Image source={{ uri: course.image }} style={styles.courseImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="book" size={64} color="#8B5FBF" />
            </View>
          )}

          {/* Featured Badge */}
          {course.isFeatured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          
          <Text style={styles.courseDescription}>{course.description}</Text>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.starsContainer}>
              {renderStars(course.ratingStats.averageRating)}
            </View>
            <Text style={styles.ratingText}>
              {course.ratingStats.averageRating.toFixed(1)} ({formatNumber(course.ratingStats.totalRatings)} reviews)
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsSection}>
            {course.enrollmentCount !== undefined && (
              <View style={styles.statItem}>
                <Ionicons name="people" size={20} color="#8B5FBF" />
                <Text style={styles.statLabel}>Students</Text>
                <Text style={styles.statValue}>{formatNumber(course.enrollmentCount)}</Text>
              </View>
            )}
            
            {course.topicCount !== undefined && (
              <View style={styles.statItem}>
                <Ionicons name="layers" size={20} color="#8B5FBF" />
                <Text style={styles.statLabel}>Topics</Text>
                <Text style={styles.statValue}>{course.topicCount}</Text>
              </View>
            )}
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesContainer}>
              {course.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* User Progress (if enrolled) */}
          {course.isEnrolled && course.userProgress && (
            <View style={styles.progressSection}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressCard}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressPercentage}>
                    {course.userProgress.progressPercentage}%
                  </Text>
                  <Text style={styles.progressText}>
                    {course.userProgress.completedTopics} of {course.topicCount} topics completed
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${course.userProgress.progressPercentage}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Enroll Button */}
      {!course.isEnrolled && (
        <View style={styles.enrollSection}>
          <LinearGradient
            colors={['#8B5FBF', '#D946EF']}
            style={styles.enrollButton}
          >
            <TouchableOpacity 
              style={styles.enrollButtonInner}
              onPress={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {course.isEnrolled && (
        <View style={styles.enrollSection}>
          <TouchableOpacity style={styles.continueButton}>
            <Ionicons name="play-circle" size={20} color="#8B5FBF" />
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 4,
  },
  courseInfo: {
    paddingHorizontal: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 32,
  },
  courseDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#999',
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  progressText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5FBF',
    borderRadius: 4,
  },
  enrollSection: {
    padding: 20,
    paddingBottom: 40,
  },
  enrollButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  enrollButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 2,
    borderColor: '#8B5FBF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5FBF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#100A1F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
