/**
 * RecipeCard.js
 * Reusable card component for displaying a recipe in a list.
 * Shows the recipe image, name, and quick info badges (prep time, difficulty, calories).
 * Tapping the card triggers the onPress callback (usually navigates to RecipeDetail).
 *
 * Wrapped in React.memo to prevent unnecessary re-renders inside FlatList.
 * Uses defensive fallbacks so the card never crashes on missing fields.
 */

import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeCard = React.memo(({ recipe, onPress }) => {
  // Guard: if recipe is null/undefined, render nothing
  if (!recipe) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Recipe image — backgroundColor acts as fallback for broken/missing URLs */}
      <Image
        source={recipe.image ? { uri: recipe.image } : undefined}
        style={styles.image}
      />
      {/* Recipe info section */}
      <View style={styles.infoContainer}>
        {/* Recipe name with fallback */}
        <Text style={styles.name} numberOfLines={1}>
          {recipe.name || 'Untitled Recipe'}
        </Text>
        {/* Quick info badges row */}
        <View style={styles.badgeRow}>
          {/* Prep time badge */}
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={14} color="#FF6B35" />
            <Text style={styles.badgeText}>{recipe.prepTime || 'N/A'}</Text>
          </View>
          {/* Difficulty badge */}
          <View style={styles.badge}>
            <Ionicons name="speedometer-outline" size={14} color="#FF6B35" />
            <Text style={styles.badgeText}>{recipe.difficulty || 'Easy'}</Text>
          </View>
          {/* Calories badge */}
          <View style={styles.badge}>
            <Ionicons name="flame-outline" size={14} color="#FF6B35" />
            <Text style={styles.badgeText}>{recipe.calories ?? 0} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    // Card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0E6DC', // Placeholder background while loading / if URL is broken
  },
  infoContainer: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default RecipeCard;
