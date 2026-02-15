/**
 * EditRecipeScreen.js
 * Form screen for editing an existing user-created recipe.
 *
 * Pre-populates all fields with the existing recipe data.
 * On save, updates the recipe in AsyncStorage and navigates back.
 *
 * The recipe object is passed via navigation params.
 *
 * Fixes applied:
 * - Defensive check on route.params?.recipe to prevent crash if navigated without data
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { updateMyRecipe } from '../utils/storage';

const EditRecipeScreen = ({ route, navigation }) => {
  // Defensive extraction: fallback to empty object if params missing
  const recipe = route.params?.recipe ?? {};

  // ─── Form State (pre-populated with existing recipe data) ─────────────────
  const [name, setName] = useState(recipe.name || '');
  const [imageUrl, setImageUrl] = useState(recipe.image || '');
  const [prepTime, setPrepTime] = useState(recipe.prepTime || '');
  const [servings, setServings] = useState(
    recipe.servings ? recipe.servings.toString() : ''
  );
  const [calories, setCalories] = useState(
    recipe.calories ? recipe.calories.toString() : ''
  );
  const [difficulty, setDifficulty] = useState(recipe.difficulty || '');
  // Convert arrays back to multi-line strings for editing
  const [ingredients, setIngredients] = useState(
    Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : ''
  );
  const [instructions, setInstructions] = useState(
    Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : ''
  );

  /**
   * Validate and save the updated recipe.
   */
  const handleSave = async () => {
    // Basic validation: name is required
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a recipe name.');
      return;
    }

    // Build the updated recipe object (keep the same ID)
    const updatedRecipe = {
      id: recipe.id,
      name: name.trim(),
      image: imageUrl.trim() || recipe.image || '',
      prepTime: prepTime.trim() || 'N/A',
      servings: parseInt(servings, 10) || 1,
      calories: parseInt(calories, 10) || 0,
      difficulty: difficulty.trim() || 'Easy',
      category: 'myfood',
      // Split multi-line text into arrays
      ingredients: ingredients
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      instructions: instructions
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    };

    // Update in AsyncStorage
    await updateMyRecipe(updatedRecipe);

    Alert.alert('Success', 'Recipe updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form title */}
        <Text style={styles.formTitle}>Edit Recipe</Text>

        {/* Recipe Name */}
        <Text style={styles.label}>Recipe Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Homemade Pizza"
          placeholderTextColor="#BBB"
          value={name}
          onChangeText={setName}
        />

        {/* Image URL */}
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor="#BBB"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        {/* Row: Prep Time + Servings */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Prep Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30 min"
              placeholderTextColor="#BBB"
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Servings</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 4"
              placeholderTextColor="#BBB"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Row: Calories + Difficulty */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 450"
              placeholderTextColor="#BBB"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Difficulty</Text>
            <TextInput
              style={styles.input}
              placeholder="Easy / Medium / Hard"
              placeholderTextColor="#BBB"
              value={difficulty}
              onChangeText={setDifficulty}
            />
          </View>
        </View>

        {/* Ingredients (multi-line) */}
        <Text style={styles.label}>Ingredients (one per line)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={"1 cup flour\n2 eggs\n1 cup milk"}
          placeholderTextColor="#BBB"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Instructions (one step per line) */}
        <Text style={styles.label}>Instructions (one step per line)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={"Preheat oven to 350°F\nMix ingredients\nBake for 25 min"}
          placeholderTextColor="#BBB"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={22} color="#FFF" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D2D2D',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2D2D2D',
    borderWidth: 1,
    borderColor: '#F0E6DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default EditRecipeScreen;
