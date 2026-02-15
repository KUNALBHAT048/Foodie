/**
 * AddRecipeScreen.js
 * Form screen for creating a new user recipe.
 *
 * Input fields:
 * - Recipe name (TextInput)
 * - Image URL (TextInput, optional - uses placeholder if empty)
 * - Prep time (TextInput)
 * - Servings (TextInput, numeric)
 * - Calories (TextInput, numeric)
 * - Difficulty (TextInput)
 * - Ingredients (multi-line TextInput, one per line)
 * - Instructions (multi-line TextInput, one per line)
 *
 * On save, the recipe is stored via AsyncStorage and the user is
 * navigated back to MyRecipesScreen.
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

import { addMyRecipe } from '../utils/storage';

// Default placeholder image for recipes without a provided image URL
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400';

const AddRecipeScreen = ({ navigation }) => {
  // ─── Form State ───────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [calories, setCalories] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  /**
   * Validate and save the recipe.
   * Requires at least a recipe name.
   * Ingredients and instructions are split by newlines into arrays.
   */
  const handleSave = async () => {
    // Basic validation: name is required
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a recipe name.');
      return;
    }

    // Build the recipe object
    const newRecipe = {
      name: name.trim(),
      image: imageUrl.trim() || PLACEHOLDER_IMAGE,
      prepTime: prepTime.trim() || 'N/A',
      servings: parseInt(servings, 10) || 1,
      calories: parseInt(calories, 10) || 0,
      difficulty: difficulty.trim() || 'Easy',
      // Split multi-line text into arrays, filtering out empty lines
      ingredients: ingredients
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
      instructions: instructions
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    };

    // Save to AsyncStorage
    const saved = await addMyRecipe(newRecipe);

    if (saved) {
      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
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
        <Text style={styles.formTitle}>Create a New Recipe</Text>

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
          placeholder="https://example.com/image.jpg (optional)"
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

        {/* Instructions (multi-line) */}
        <Text style={styles.label}>Instructions (one step per line)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder={"Preheat oven to 350°F\nMix ingredients together\nBake for 25 minutes"}
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
          <Text style={styles.saveButtonText}>Save Recipe</Text>
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

export default AddRecipeScreen;

