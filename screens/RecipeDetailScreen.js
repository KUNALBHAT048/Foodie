/**
 * RecipeDetailScreen.js
 * Displays full details for a selected recipe.
 *
 * Shows: image, name, ingredients, step-by-step instructions,
 * prep time, servings, calories, difficulty, and a heart icon to favorite/unfavorite.
 *
 * The recipe object is passed via navigation params.
 *
 * Fixes applied:
 * - useSafeAreaInsets() for dynamic overlay button positioning (works on all devices)
 * - Defensive check on route.params to prevent crash if recipe is undefined
 * - Optional chaining / fallbacks on all recipe fields
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Storage utilities for favorites
import { getFavorites, toggleFavorite } from '../utils/storage';

const RecipeDetailScreen = ({ route, navigation }) => {
  // Defensive extraction: if route.params or recipe is missing, use empty object
  const recipe = route.params?.recipe ?? {};

  // Get safe area insets for dynamic button positioning on notched devices
  const insets = useSafeAreaInsets();

  // State: whether the current recipe is favorited
  const [isFavorited, setIsFavorited] = useState(false);

  // Check favorite status every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      // Only check if we have a valid recipe id
      if (!recipe.id) return;
      const checkFavorite = async () => {
        const favorites = await getFavorites();
        setIsFavorited(favorites.includes(recipe.id));
      };
      checkFavorite();
    }, [recipe.id])
  );

  /**
   * Toggle the favorite state for this recipe.
   * Updates AsyncStorage and local state.
   */
  const handleToggleFavorite = async () => {
    if (!recipe.id) return;
    const updatedFavorites = await toggleFavorite(recipe.id);
    setIsFavorited(updatedFavorites.includes(recipe.id));
  };

  // Calculate top position for overlay buttons based on device safe area
  const buttonTop = insets.top + 10;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Recipe image with overlay back button and favorite button */}
      <View style={styles.imageContainer}>
        <Image
          source={recipe.image ? { uri: recipe.image } : undefined}
          style={styles.image}
        />

        {/* Back button overlay (top-left) — dynamically positioned via insets */}
        <TouchableOpacity
          style={[styles.overlayButton, { top: buttonTop, left: 16 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D2D2D" />
        </TouchableOpacity>

        {/* Favorite heart button overlay (top-right) — dynamically positioned via insets */}
        <TouchableOpacity
          style={[styles.overlayButton, { top: buttonTop, right: 16 }]}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color="#E8505B"
          />
        </TouchableOpacity>
      </View>

      {/* Recipe content */}
      <View style={styles.content}>
        {/* Recipe name */}
        <Text style={styles.name}>{recipe.name || 'Untitled Recipe'}</Text>

        {/* Quick info row: prep time, servings, calories, difficulty */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#FF6B35" />
            <Text style={styles.infoLabel}>Prep Time</Text>
            <Text style={styles.infoValue}>{recipe.prepTime || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={20} color="#FF6B35" />
            <Text style={styles.infoLabel}>Servings</Text>
            <Text style={styles.infoValue}>{recipe.servings ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flame-outline" size={20} color="#FF6B35" />
            <Text style={styles.infoLabel}>Calories</Text>
            <Text style={styles.infoValue}>{recipe.calories ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="speedometer-outline" size={20} color="#FF6B35" />
            <Text style={styles.infoLabel}>Difficulty</Text>
            <Text style={styles.infoValue}>{recipe.difficulty || 'N/A'}</Text>
          </View>
        </View>

        {/* Ingredients section — only rendered when data exists */}
        <Text style={styles.sectionTitle}>🥘 Ingredients</Text>
        <View style={styles.ingredientsList}>
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <View key={index.toString()} style={styles.ingredientItem}>
                <View style={styles.bullet} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No ingredients listed.</Text>
          )}
        </View>

        {/* Step-by-step instructions section */}
        <Text style={styles.sectionTitle}>📝 Instructions</Text>
        <View style={styles.instructionsList}>
          {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
            recipe.instructions.map((step, index) => (
              <View key={index.toString()} style={styles.instructionItem}>
                {/* Step number circle */}
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>No instructions listed.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0E6DC',
  },
  // Circular overlay buttons on the image (top/left/right set via inline styles)
  overlayButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    padding: 20,
    // Rounded top corners to overlap the image
    marginTop: -20,
    backgroundColor: '#FFFBF0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D2D2D',
    marginBottom: 16,
  },
  // Quick info row styles
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D2D2D',
    marginTop: 2,
  },
  // Section title (Ingredients / Instructions)
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 12,
  },
  // Ingredients list styles
  ingredientsList: {
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 6,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
  },
  // Instructions list styles
  instructionsList: {
    marginBottom: 40,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  instructionText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  // Placeholder when no ingredients/instructions
  placeholderText: {
    fontSize: 14,
    color: '#BBB',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});

export default RecipeDetailScreen;
