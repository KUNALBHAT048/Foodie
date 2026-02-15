/**
 * MyRecipesScreen.js
 * Displays all user-created recipes stored in AsyncStorage.
 *
 * Features:
 * - Lists user recipes with Edit and Delete buttons
 * - Delete removes the recipe from storage and updates the list
 * - Edit navigates to EditRecipeScreen with the recipe data
 * - "Add Recipe" button in the header navigates to AddRecipeScreen
 * - Empty state encourages user to add their first recipe
 * - Refreshes on focus to reflect any changes
 */

import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getMyRecipes, deleteMyRecipe } from '../utils/storage';

const MyRecipesScreen = ({ navigation }) => {
  // State: user-created recipes
  const [myRecipes, setMyRecipes] = useState([]);

  // Add "+" button in the header for adding new recipes
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddRecipe')}
          style={styles.headerButton}
        >
          <Ionicons name="add-circle" size={28} color="#FF6B35" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Reload recipes every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadRecipes = async () => {
        const recipes = await getMyRecipes();
        setMyRecipes(recipes);
      };
      loadRecipes();
    }, [])
  );

  /**
   * Handle recipe deletion with confirmation dialog.
   * @param {string} recipeId - ID of the recipe to delete
   * @param {string} recipeName - Name for the confirmation message
   */
  const handleDelete = (recipeId, recipeName) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMyRecipe(recipeId);
            // Refresh the list after deletion
            const updated = await getMyRecipes();
            setMyRecipes(updated);
          },
        },
      ]
    );
  };

  /** Render a single user recipe item with Edit and Delete buttons */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      {/* Recipe image thumbnail */}
      <Image source={{ uri: item.image }} style={styles.thumbnail} />
      {/* Recipe info */}
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recipeCategory}>
          {item.prepTime} · {item.difficulty}
        </Text>
        {/* Action buttons */}
        <View style={styles.actionRow}>
          {/* Edit button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditRecipe', { recipe: item })}
          >
            <Ionicons name="create-outline" size={16} color="#FFF" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          {/* Delete button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={16} color="#FFF" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  /** Empty state component */
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>No Recipes Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the + button to add your first recipe!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myRecipes}
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
  headerButton: {
    marginRight: 8,
    padding: 4,
  },
  // Recipe item card
  recipeItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: 110,
    height: 130,
    backgroundColor: '#F0E6DC',
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  recipeCategory: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8505B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Empty state
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

export default MyRecipesScreen;

