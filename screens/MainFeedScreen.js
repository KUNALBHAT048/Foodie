/**
 * MainFeedScreen.js
 * The home screen of the Foodie app.
 *
 * Features:
 * - Horizontal scrollable category list (10+ categories)
 * - Recipe list filtered by selected category
 * - Tapping a recipe navigates to RecipeDetailScreen
 * - Tapping "My Food" category navigates to MyRecipesScreen
 * - Header has a favorites button (heart icon)
 *
 * Fixes applied:
 * - SafeAreaView for notch/status-bar safety
 * - ScrollView for categories (avoids nested VirtualizedList warning)
 * - Header passed as JSX element (avoids unmount/remount & scroll-position reset)
 * - Removed duplicate StatusBar (App.js already handles it via expo-status-bar)
 * - filteredRecipes memoised with useMemo
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Import mock data
import { CATEGORIES, MOCK_RECIPES } from '../data/mockData';
// Import reusable components
import CategoryItem from '../components/CategoryItem';
import RecipeCard from '../components/RecipeCard';
// Import storage utilities to load user recipes
import { getMyRecipes } from '../utils/storage';

const MainFeedScreen = ({ navigation }) => {
  // State: currently selected category (default "all")
  const [selectedCategory, setSelectedCategory] = useState('all');
  // State: combined recipes (mock + user-created)
  const [allRecipes, setAllRecipes] = useState(MOCK_RECIPES);

  // Reload user recipes every time this screen is focused.
  // This ensures newly added recipes appear immediately.
  useFocusEffect(
    useCallback(() => {
      const loadRecipes = async () => {
        const userRecipes = await getMyRecipes();
        // Combine mock recipes with user-created recipes
        setAllRecipes([...MOCK_RECIPES, ...userRecipes]);
      };
      loadRecipes();
    }, [])
  );

  /**
   * Handle category selection.
   * Special case: "myfood" navigates to MyRecipesScreen instead of filtering.
   */
  const handleCategoryPress = (categoryId) => {
    if (categoryId === 'myfood') {
      // Navigate to MyRecipesScreen for user-created recipes
      navigation.navigate('MyRecipes');
    } else {
      // Set selected category to filter recipes
      setSelectedCategory(categoryId);
    }
  };

  // Memoize filtered recipes so the array reference only changes
  // when selectedCategory or allRecipes actually change.
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === 'all') {
      // "all" shows every recipe except user-created ones (those are in My Food)
      return allRecipes.filter((r) => r.category !== 'myfood');
    }
    return allRecipes.filter((r) => r.category === selectedCategory);
  }, [selectedCategory, allRecipes]);

  // ─── Render Functions ───────────────────────────────────────────────────────

  /** Renders a single recipe card in the vertical list */
  const renderRecipeItem = useCallback(
    ({ item }) => (
      <RecipeCard
        recipe={item}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      />
    ),
    [navigation]
  );

  /**
   * List header built as a JSX *element* (not a component function).
   *
   * Why this matters:
   * If we defined this as `const ListHeader = () => (...)` and passed it
   * as `ListHeaderComponent={ListHeader}`, React would see a NEW component
   * type on every render → unmount + remount the header → reset the
   * horizontal category scroll position. By building plain JSX we avoid that.
   *
   * Uses ScrollView instead of FlatList for the categories to avoid the
   * "VirtualizedLists should never be nested" warning.
   */
  const listHeader = (
    <View>
      {/* App title bar */}
      <View style={styles.titleBar}>
        <View>
          <Text style={styles.greeting}>What would you like to cook?</Text>
          <Text style={styles.title}>🍽️ Foodie</Text>
        </View>
        {/* Favorites button */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart" size={24} color="#E8505B" />
        </TouchableOpacity>
      </View>

      {/* Horizontal scrollable category list — ScrollView (not FlatList) to avoid nesting warning */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {CATEGORIES.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            isActive={selectedCategory === cat.id}
            onPress={() => handleCategoryPress(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Section title for recipes */}
      <Text style={styles.sectionTitle}>
        {selectedCategory === 'all'
          ? 'Popular Recipes'
          : (CATEGORIES.find((c) => c.id === selectedCategory)?.name || '') +
            ' Recipes'}
      </Text>
    </View>
  );

  /** Empty state when no recipes match the filter */
  const listEmpty = (
    <View style={styles.emptyContainer}>
      <Ionicons name="restaurant-outline" size={64} color="#CCC" />
      <Text style={styles.emptyText}>No recipes found in this category</Text>
    </View>
  );

  return (
    // SafeAreaView with edges={['top']} prevents content from hiding behind
    // the notch / status bar on modern devices (headerShown is false for this screen)
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Main recipe list with categories as header */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipeList}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0', // Warm white background
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D2D2D',
  },
  favButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  recipeList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default MainFeedScreen;
