/**
 * CategoryItem.js
 * Reusable component for rendering a single category pill/button.
 * Displays an Ionicons icon and the category name.
 * Highlights when the category is currently selected (active).
 *
 * Wrapped in React.memo to prevent unnecessary re-renders inside FlatList/ScrollView.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryItem = React.memo(({ category, isActive, onPress }) => {
  // Guard: if category data is missing, render nothing
  if (!category) return null;

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Category icon from Ionicons */}
      <Ionicons
        name={category.icon || 'ellipse'}
        size={18}
        color={isActive ? '#FFF' : '#FF6B35'}
        style={styles.icon}
      />
      {/* Category name label */}
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {category.name || 'Category'}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    marginRight: 10,
    // Subtle shadow for card-like feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0E6DC',
  },
  // Active state styling — filled with primary color
  activeContainer: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeLabel: {
    color: '#FFF',
  },
});

export default CategoryItem;
