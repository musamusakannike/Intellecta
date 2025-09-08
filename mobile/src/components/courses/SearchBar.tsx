import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onFocus,
  onBlur,
  placeholder = "Search courses..."
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusedAnim = new Animated.Value(0);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusedAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusedAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
  };

  const handleSubmit = () => {
    onSearch(value);
  };

  const borderColor = focusedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(139, 95, 191, 0.3)', '#8B5FBF'],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.searchContainer,
          { borderColor }
        ]}
      >
        <Ionicons name="search" size={20} color="#8B5FBF" style={styles.searchIcon} />
        
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#666"
          returnKeyType="search"
          clearButtonMode="never"
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'rgba(139, 95, 191, 0.3)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchBar;
