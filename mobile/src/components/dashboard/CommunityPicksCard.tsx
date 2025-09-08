import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CommunityPick } from '../../services/dashboardService';

interface CommunityPicksCardProps {
  communityPicks: CommunityPick[];
  onCoursePress?: (courseId: string) => void;
  onViewAllPress?: () => void;
}

const CommunityPicksCard: React.FC<CommunityPicksCardProps> = ({ 
  communityPicks, 
  onCoursePress,
  onViewAllPress 
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#888" />
      );
    }

    return stars;
  };

  if (!communityPicks || communityPicks.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="people-outline" size={40} color="#8B5FBF" />
        </View>
        <Text style={styles.emptyTitle}>No Community Picks</Text>
        <Text style={styles.emptySubtitle}>Featured courses will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(139, 95, 191, 0.1)', 'rgba(139, 95, 191, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Community Picks</Text>
          <TouchableOpacity onPress={onViewAllPress}>
            <Ionicons name="chevron-forward" size={24} color="#8B5FBF" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesContainer}
        >
          {communityPicks.map((course) => (
            <TouchableOpacity
              key={course._id}
              style={styles.courseCard}
              onPress={() => onCoursePress && onCoursePress(course._id)}
            >
              <View style={styles.courseImageContainer}>
                {course.image ? (
                  <Image source={{ uri: course.image }} style={styles.courseImage} />
                ) : (
                  <View style={styles.courseImagePlaceholder}>
                    <Ionicons name="book" size={24} color="#8B5FBF" />
                  </View>
                )}
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                
                <Text style={styles.courseDescription} numberOfLines={3}>
                  {course.description}
                </Text>

                <View style={styles.courseMetrics}>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {renderStars(course.rating)}
                    </View>
                    <Text style={styles.ratingText}>
                      {course.rating.toFixed(1)} ({course.totalRatings})
                    </Text>
                  </View>
                </View>

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
            </TouchableOpacity>
          ))}
        </ScrollView>

        {communityPicks.length > 0 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
            <Text style={styles.viewAllText}>View All Featured Courses</Text>
            <Ionicons name="arrow-forward" size={16} color="#8B5FBF" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
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
    marginHorizontal: 20,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  coursesContainer: {
    paddingRight: 16,
  },
  courseCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.2)',
  },
  courseImageContainer: {
    marginBottom: 12,
  },
  courseImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  courseImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 16,
    marginBottom: 8,
  },
  courseMetrics: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 10,
    color: '#888',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  categoryTag: {
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 9,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  moreCategoriesText: {
    fontSize: 9,
    color: '#888',
    fontStyle: 'italic',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5FBF',
    marginRight: 6,
  },
  // Empty state styles
  emptyContainer: {
    backgroundColor: 'rgba(139, 95, 191, 0.05)',
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 20,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default CommunityPicksCard;
