import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Course } from '../../services/coursesService';

interface CourseCardProps {
  course: Course;
  onPress: (courseId: string) => void;
  style?: any;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, style }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFD700" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#555" />
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

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={() => onPress(course._id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']}
        style={styles.gradient}
      >
        {/* Course Image */}
        <View style={styles.imageContainer}>
          {course.image ? (
            <Image source={{ uri: course.image }} style={styles.courseImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="book" size={32} color="#8B5FBF" />
            </View>
          )}
          
          {/* Featured Badge */}
          {course.isFeatured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle} numberOfLines={2}>
            {course.title}
          </Text>
          
          <Text style={styles.courseDescription} numberOfLines={3}>
            {course.description}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(course.ratingStats.averageRating)}
            </View>
            <Text style={styles.ratingText}>
              {course.ratingStats.averageRating.toFixed(1)} ({formatNumber(course.ratingStats.totalRatings)})
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {course.enrollmentCount !== undefined && (
              <View style={styles.statItem}>
                <Ionicons name="people" size={14} color="#8B5FBF" />
                <Text style={styles.statText}>{formatNumber(course.enrollmentCount)}</Text>
              </View>
            )}
            
            {course.topicCount !== undefined && (
              <View style={styles.statItem}>
                <Ionicons name="layers" size={14} color="#8B5FBF" />
                <Text style={styles.statText}>{course.topicCount} topics</Text>
              </View>
            )}
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {course.categories.slice(0, 2).map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
            {course.categories.length > 2 && (
              <Text style={styles.moreCategoriesText}>
                +{course.categories.length - 2}
              </Text>
            )}
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
    borderColor: 'rgba(139, 95, 191, 0.3)',
    overflow: 'hidden',
    shadowColor: '#8B5FBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  gradient: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  courseImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 4,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  courseDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 18,
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
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
    color: '#8B5FBF',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  moreCategoriesText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default CourseCard;
