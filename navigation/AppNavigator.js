/**
 * AppNavigator.js
 * Defines the main navigation structure using React Navigation's Native Stack.
 *
 * Stack screens:
 * 1. MainFeed     – Home screen with categories and recipe list
 * 2. RecipeDetail – Full recipe details with favorite toggle
 * 3. Favorites    – List of favorited recipes
 * 4. MyRecipes    – List of user-created recipes (with Edit/Delete)
 * 5. AddRecipe    – Form to create a new recipe
 * 6. EditRecipe   – Form to edit an existing user recipe
 *
 * All screens have proper back navigation via the stack navigator's header.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import MainFeedScreen from '../screens/MainFeedScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MyRecipesScreen from '../screens/MyRecipesScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import EditRecipeScreen from '../screens/EditRecipeScreen';

// Create the stack navigator instance
const Stack = createNativeStackNavigator();

/**
 * AppNavigator component
 * Wraps all app screens in a Stack Navigator with consistent styling.
 * The header uses a warm color scheme matching the app's foodie theme.
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainFeed"
      screenOptions={{
        // Global header styling for all screens
        headerStyle: {
          backgroundColor: '#FFFBF0',
        },
        headerTintColor: '#FF6B35', // Back arrow and title color
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: '#2D2D2D',
        },
        headerShadowVisible: false, // Clean look without bottom border
        // Enable back gesture on iOS
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      {/* Home screen — hide default header since we have a custom title bar */}
      <Stack.Screen
        name="MainFeed"
        component={MainFeedScreen}
        options={{ headerShown: false }}
      />

      {/* Recipe detail — hide header since we have custom overlay buttons */}
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ headerShown: false }}
      />

      {/* Favorites screen — show header with back button */}
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: '❤️ My Favorites' }}
      />

      {/* My Recipes screen — show header with back button */}
      <Stack.Screen
        name="MyRecipes"
        component={MyRecipesScreen}
        options={{ title: '👨‍🍳 My Recipes' }}
      />

      {/* Add Recipe screen — show header with back button */}
      <Stack.Screen
        name="AddRecipe"
        component={AddRecipeScreen}
        options={{ title: '➕ Add Recipe' }}
      />

      {/* Edit Recipe screen — show header with back button */}
      <Stack.Screen
        name="EditRecipe"
        component={EditRecipeScreen}
        options={{ title: '✏️ Edit Recipe' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

