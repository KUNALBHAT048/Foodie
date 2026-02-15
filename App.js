/**
 * App.js
 * Entry point for the Foodie React Native Expo app.
 *
 * Wraps the entire app in:
 * - SafeAreaProvider: Ensures proper safe area insets on all devices
 * - NavigationContainer: Required by React Navigation
 * - AppNavigator: The stack navigator defining all screens
 *
 * This file is registered as the main entry point in package.json.
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Import the main stack navigator
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* NavigationContainer manages navigation state */}
      <NavigationContainer>
        {/* StatusBar: light/dark based on device theme */}
        <StatusBar style="dark" />
        {/* Main stack navigator with all screens */}
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

