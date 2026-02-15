/**
 * FavoritesScreen.js
 * Displays all recipes that the user has favorited.
 *
 * Features:
 * - Loads favorite IDs from AsyncStorage
 * - Matches IDs against mock recipes and user-created recipes
 * - Tapping a recipe navigates to RecipeDetailScreen
 * - Empty state when no favorites exist
 * - Refreshes when screen is focused (so unfavoriting from detail screen reflects here)
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { MOCK_RECIPES } from '../data/mockData';
import { getFavorites, getMyRecipes } from '../utils/storage';
import RecipeCard from '../components/RecipeCard';

const FavoritesScreen = ({ navigation }) => {
  // State: list of favorited recipe objects
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  // Reload favorites every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        // Get the list of favorited recipe IDs
        const favoriteIds = await getFavorites();
        // Get user-created recipes as well
        const userRecipes = await getMyRecipes();
        // Combine all available recipes
        const allRecipes = [...MOCK_RECIPES, ...userRecipes];
        // Filter to only favorited ones, preserving order
        const favRecipes = allRecipes.filter((r) =>
          favoriteIds.includes(r.id)
        );
        setFavoriteRecipes(favRecipes);
      };
      loadFavorites();
    }, [])
  );

  /** Render a recipe card */
  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    />
  );

  /** Empty state component */
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any recipe to save it here!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  list: {
    padding: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FavoritesScreen;

