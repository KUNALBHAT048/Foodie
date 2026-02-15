/**
 * storage.js
 * Utility functions for persisting data using AsyncStorage.
 * Handles favorites and user-created recipes (My Recipes).
 *
 * Keys used:
 *  - @foodie_favorites : Array of recipe IDs that the user has favorited
 *  - @foodie_my_recipes : Array of full recipe objects the user has created
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys (prefixed to avoid collisions)
const FAVORITES_KEY = '@foodie_favorites';
const MY_RECIPES_KEY = '@foodie_my_recipes';

// ─── Favorites ────────────────────────────────────────────────────────────────

/**
 * Retrieve the list of favorited recipe IDs from storage.
 * Returns an empty array if nothing is stored yet.
 */
export const getFavorites = async () => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
};

/**
 * Save the full favorites array to storage.
 * @param {string[]} favorites - Array of recipe IDs
 */
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

/**
 * Toggle a recipe's favorite status.
 * If the recipe ID is already in favorites, remove it; otherwise add it.
 * @param {string} recipeId - The ID of the recipe to toggle
 * @returns {string[]} The updated favorites array
 */
export const toggleFavorite = async (recipeId) => {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(recipeId);

    if (index > -1) {
      // Recipe is already favorited — remove it
      favorites.splice(index, 1);
    } else {
      // Recipe is not favorited — add it
      favorites.push(recipeId);
    }

    await saveFavorites(favorites);
    return favorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return [];
  }
};

// ─── My Recipes (User-Created) ───────────────────────────────────────────────

/**
 * Retrieve all user-created recipes from storage.
 * Returns an empty array if nothing is stored yet.
 */
export const getMyRecipes = async () => {
  try {
    const json = await AsyncStorage.getItem(MY_RECIPES_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error reading my recipes:', error);
    return [];
  }
};

/**
 * Save the full user recipes array to storage.
 * @param {Object[]} recipes - Array of recipe objects
 */
export const saveMyRecipes = async (recipes) => {
  try {
    await AsyncStorage.setItem(MY_RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving my recipes:', error);
  }
};

/**
 * Add a new user-created recipe.
 * Generates a unique ID using the current timestamp.
 * @param {Object} recipe - Recipe object (without id)
 * @returns {Object} The saved recipe with generated ID
 */
export const addMyRecipe = async (recipe) => {
  try {
    const recipes = await getMyRecipes();
    // Generate a unique ID using timestamp
    const newRecipe = {
      ...recipe,
      id: 'user_' + Date.now().toString(),
      category: 'myfood', // User recipes always belong to "My Food"
    };
    recipes.push(newRecipe);
    await saveMyRecipes(recipes);
    return newRecipe;
  } catch (error) {
    console.error('Error adding recipe:', error);
    return null;
  }
};

/**
 * Update an existing user-created recipe.
 * Finds the recipe by ID and replaces it with updated data.
 * @param {Object} updatedRecipe - Recipe object with id and updated fields
 */
export const updateMyRecipe = async (updatedRecipe) => {
  try {
    const recipes = await getMyRecipes();
    const index = recipes.findIndex((r) => r.id === updatedRecipe.id);
    if (index > -1) {
      recipes[index] = { ...recipes[index], ...updatedRecipe };
      await saveMyRecipes(recipes);
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
  }
};

/**
 * Delete a user-created recipe by its ID.
 * @param {string} recipeId - The ID of the recipe to delete
 */
export const deleteMyRecipe = async (recipeId) => {
  try {
    const recipes = await getMyRecipes();
    const filtered = recipes.filter((r) => r.id !== recipeId);
    await saveMyRecipes(filtered);
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

