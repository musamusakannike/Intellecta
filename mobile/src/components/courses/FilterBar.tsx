import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourseFilters } from '../../services/coursesService';

interface FilterBarProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
  categories: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, categories }) => {
  const [showSortModal, setShowSortModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const sortOptions = [
    { key: 'relevance', label: 'Relevance', icon: 'star' },
    { key: 'newest', label: 'Newest', icon: 'time' },
    { key: 'rating', label: 'Highest Rated', icon: 'star-half' },
    { key: 'popularity', label: 'Most Popular', icon: 'people' },
    { key: 'title', label: 'A-Z', icon: 'text' },
  ];

  const ratingOptions = [
    { min: 4.5, label: '4.5+ Stars' },
    { min: 4.0, label: '4.0+ Stars' },
    { min: 3.5, label: '3.5+ Stars' },
    { min: 3.0, label: '3.0+ Stars' },
  ];

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortBy === 'title' ? 'asc' : 'desc'
    });
    setShowSortModal(false);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = filters.category === category ? undefined : category;
    onFiltersChange({
      ...filters,
      category: newCategory
    });
    setShowCategoryModal(false);
  };

  const handleRatingChange = (minRating: number) => {
    const newMinRating = filters.minRating === minRating ? undefined : minRating;
    onFiltersChange({
      ...filters,
      minRating: newMinRating
    });
    setShowRatingModal(false);
  };

  const toggleFeatured = () => {
    onFiltersChange({
      ...filters,
      featured: filters.featured ? undefined : true
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    if (key === 'sortBy' || key === 'sortOrder' || key === 'page' || key === 'limit') return false;
    return filters[key as keyof CourseFilters] !== undefined;
  }).length;

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === filters.sortBy);
    return option?.label || 'Relevance';
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Sort */}
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowSortModal(true)}>
          <Ionicons name="swap-vertical" size={16} color="#8B5FBF" />
          <Text style={styles.filterButtonText}>{getSortLabel()}</Text>
        </TouchableOpacity>

        {/* Category */}
        <TouchableOpacity 
          style={[styles.filterButton, filters.category && styles.activeFilterButton]} 
          onPress={() => setShowCategoryModal(true)}
        >
          <Ionicons name="folder" size={16} color={filters.category ? "#FFFFFF" : "#8B5FBF"} />
          <Text style={[styles.filterButtonText, filters.category && styles.activeFilterText]}>
            {filters.category || 'Category'}
          </Text>
        </TouchableOpacity>

        {/* Rating */}
        <TouchableOpacity 
          style={[styles.filterButton, filters.minRating && styles.activeFilterButton]} 
          onPress={() => setShowRatingModal(true)}
        >
          <Ionicons name="star" size={16} color={filters.minRating ? "#FFFFFF" : "#8B5FBF"} />
          <Text style={[styles.filterButtonText, filters.minRating && styles.activeFilterText]}>
            {filters.minRating ? `${filters.minRating}+ Stars` : 'Rating'}
          </Text>
        </TouchableOpacity>

        {/* Featured */}
        <TouchableOpacity 
          style={[styles.filterButton, filters.featured && styles.activeFilterButton]} 
          onPress={toggleFeatured}
        >
          <Ionicons name="star-half" size={16} color={filters.featured ? "#FFFFFF" : "#8B5FBF"} />
          <Text style={[styles.filterButtonText, filters.featured && styles.activeFilterText]}>Featured</Text>
        </TouchableOpacity>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Ionicons name="close-circle" size={16} color="#FF6B6B" />
            <Text style={styles.clearButtonText}>Clear ({activeFiltersCount})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort by</Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[styles.modalOption, filters.sortBy === option.key && styles.activeModalOption]}
                onPress={() => handleSortChange(option.key)}
              >
                <Ionicons name={option.icon as any} size={20} color={filters.sortBy === option.key ? "#8B5FBF" : "#666"} />
                <Text style={[styles.modalOptionText, filters.sortBy === option.key && styles.activeModalOptionText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowCategoryModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Category</Text>
            <TouchableOpacity
              style={[styles.modalOption, !filters.category && styles.activeModalOption]}
              onPress={() => handleCategoryChange('')}
            >
              <Ionicons name="apps" size={20} color={!filters.category ? "#8B5FBF" : "#666"} />
              <Text style={[styles.modalOptionText, !filters.category && styles.activeModalOptionText]}>
                All Categories
              </Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.modalOption, filters.category === category && styles.activeModalOption]}
                onPress={() => handleCategoryChange(category)}
              >
                <Ionicons name="folder" size={20} color={filters.category === category ? "#8B5FBF" : "#666"} />
                <Text style={[styles.modalOptionText, filters.category === category && styles.activeModalOptionText]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={showRatingModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowRatingModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Minimum Rating</Text>
            <TouchableOpacity
              style={[styles.modalOption, !filters.minRating && styles.activeModalOption]}
              onPress={() => handleRatingChange(0)}
            >
              <Ionicons name="star-outline" size={20} color={!filters.minRating ? "#8B5FBF" : "#666"} />
              <Text style={[styles.modalOptionText, !filters.minRating && styles.activeModalOptionText]}>
                Any Rating
              </Text>
            </TouchableOpacity>
            {ratingOptions.map(option => (
              <TouchableOpacity
                key={option.min}
                style={[styles.modalOption, filters.minRating === option.min && styles.activeModalOption]}
                onPress={() => handleRatingChange(option.min)}
              >
                <Ionicons name="star" size={20} color={filters.minRating === option.min ? "#8B5FBF" : "#666"} />
                <Text style={[styles.modalOptionText, filters.minRating === option.min && styles.activeModalOptionText]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 95, 191, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeFilterButton: {
    backgroundColor: '#8B5FBF',
    borderColor: '#8B5FBF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#8B5FBF',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  activeModalOption: {
    backgroundColor: 'rgba(139, 95, 191, 0.2)',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  activeModalOptionText: {
    color: '#8B5FBF',
    fontWeight: '600',
  },
});

export default FilterBar;
