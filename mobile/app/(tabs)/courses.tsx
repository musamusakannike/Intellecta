import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../src/components/courses/SearchBar';
import FilterBar from '../../src/components/courses/FilterBar';
import CourseCard from '../../src/components/courses/CourseCard';
import coursesService, { Course, CourseFilters, CoursesResponse } from '../../src/services/coursesService';

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false
  });
  const [filters, setFilters] = useState<CourseFilters>({
    sortBy: 'relevance',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  // Load courses
  const loadCourses = async (newFilters?: CourseFilters, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const currentFilters = newFilters || filters;
      const response: CoursesResponse = await coursesService.getCourses(currentFilters);
      console.log("Courses response:", JSON.stringify(response, null, 2));
      
      if (append) {
        setCourses(prev => [...prev, ...response.courses]);
      } else {
        setCourses(response.courses);
      }
      
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const categoriesData = await coursesService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Use default categories if API fails
      setCategories(['programming', 'web development', 'mobile development', 'data science', 'design']);
    }
  };

  // Initial load
  useEffect(() => {
    loadCourses();
    loadCategories();
  }, []);

  // Reload when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (courses.length === 0) {
        loadCourses();
      }
    }, [])
  );

  // Handle search
  const handleSearch = (text: string) => {
    const newFilters = {
      ...filters,
      search: text || undefined,
      page: 1
    };
    setFilters(newFilters);
    loadCourses(newFilters);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: CourseFilters) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);
    loadCourses(updatedFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    const refreshFilters = { ...filters, page: 1 };
    setFilters(refreshFilters);
    loadCourses(refreshFilters);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loadingMore) {
      const nextPageFilters = { ...filters, page: pagination.currentPage + 1 };
      setFilters(nextPageFilters);
      loadCourses(nextPageFilters, true);
    }
  };

  // Handle course press
  const handleCoursePress = (courseId: string) => {
    // Navigate to course details
    router.push(`/course/${courseId}`);
  };

  // Render course item
  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard 
      course={item} 
      onPress={handleCoursePress}
      style={{ marginHorizontal: 20 }}
    />
  );

  // Render loading footer
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#8B5FBF" />
        <Text style={styles.loadingText}>Loading more courses...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Ionicons name="school-outline" size={64} color="#666" />
        <Text style={styles.emptyTitle}>
          {searchText || Object.keys(filters).some(key => filters[key as keyof CourseFilters]) 
            ? 'No courses found' 
            : 'No courses available'
          }
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchText 
            ? 'Try adjusting your search or filters'
            : 'Check back later for new courses'
          }
        </Text>
        {(searchText || Object.keys(filters).some(key => filters[key as keyof CourseFilters])) && (
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={() => {
              setSearchText('');
              handleFiltersChange({ sortBy: 'relevance', sortOrder: 'desc' });
            }}
          >
            <Text style={styles.clearFiltersButtonText}>Clear Search & Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subtitle}>
          {pagination.totalPages > 0 && (
            `${courses.length} of ${pagination.currentPage * filters.limit!} courses`
          )}
        </Text>
      </View>

      {/* Search */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
        placeholder="Search courses..."
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
      />

      {/* Courses List */}
      {loading && courses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5FBF" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8B5FBF"
              colors={['#8B5FBF']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={[
            styles.listContainer,
            courses.length === 0 && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#8B5FBF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
