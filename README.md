# 🍽️ Foodie — React Native Expo Recipe App

A full-featured recipe browsing app built with **React Native** and **Expo SDK 54**. Users can browse recipes by category, view detailed instructions, favorite recipes, and create/edit/delete their own recipes — all with persistent local storage.

---

## 📸 App Screens

| Main Feed | Recipe Detail | Favorites | My Recipes | Add Recipe |
|-----------|--------------|-----------|------------|------------|
| Browse by category | Full details + favorite toggle | Saved favorites | User-created recipes | Create new recipe |

---

## ✅ Features

- **Browse Recipes by Category** — 10 horizontal scrollable categories (Breakfast, Lunch, Dinner, Snacks, Desserts, Vegan, Drinks, Salads, Fast Food, My Food)
- **Recipe Detail View** — Image, name, ingredients list, step-by-step instructions, prep time, servings, calories, difficulty
- **Favorite Recipes** — Heart icon to favorite/unfavorite; favorites persisted via AsyncStorage
- **Favorites Screen** — View all favorited recipes in one place
- **My Recipes (My Food)** — View, edit, and delete user-created recipes
- **Add Recipe** — Full form with name, image URL, prep time, servings, calories, difficulty, ingredients, and instructions
- **Edit Recipe** — Pre-populated form to update any field of a user recipe
- **Persistent Storage** — Favorites and user recipes stored locally using AsyncStorage
- **12 Mock Recipes** — Complete recipe data across 9 categories
- **Back Navigation** — Works on every screen via stack navigator headers and custom back buttons
- **Safe Area Support** — Properly handles notched devices (iPhone X+, modern Android)
- **Reusable Components** — `RecipeCard` and `CategoryItem` used across multiple screens
- **Empty States** — Friendly UI when no recipes or favorites exist
- **Icons** — Ionicons from `@expo/vector-icons` throughout the app

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React Native | Mobile app framework |
| Expo SDK 54 | Development toolchain |
| React Navigation 7 (Native Stack) | Screen navigation with back button support |
| AsyncStorage | Local data persistence for favorites & user recipes |
| @expo/vector-icons (Ionicons) | UI icons |
| react-native-safe-area-context | Notch/status bar safe rendering |

---

## 📂 Project Structure

```
Foodie/
├── App.js                          # Entry point — SafeAreaProvider + NavigationContainer
├── app.json                        # Expo configuration
├── package.json                    # Dependencies and scripts
│
├── components/
│   ├── CategoryItem.js             # Reusable category pill/button (React.memo)
│   └── RecipeCard.js               # Reusable recipe card with image + badges (React.memo)
│
├── data/
│   └── mockData.js                 # 12 mock recipes + 11 category definitions
│
├── navigation/
│   └── AppNavigator.js             # Stack Navigator — 6 screens
│
├── screens/
│   ├── MainFeedScreen.js           # Home — categories + filtered recipe list
│   ├── RecipeDetailScreen.js       # Full recipe details + favorite toggle
│   ├── FavoritesScreen.js          # All favorited recipes
│   ├── MyRecipesScreen.js          # User-created recipes (Edit / Delete)
│   ├── AddRecipeScreen.js          # Form to create a new recipe
│   └── EditRecipeScreen.js         # Form to edit an existing recipe
│
├── utils/
│   └── storage.js                  # AsyncStorage helpers (get/save/toggle favorites, CRUD recipes)
│
└── assets/
    └── images/                     # App icons, splash screen
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **Expo Go** app installed on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# 1. Navigate to the project folder
cd Foodie

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

### Running on Your Device

1. After running `npx expo start`, a QR code will appear in the terminal
2. **Android** — Open the Expo Go app and scan the QR code
3. **iOS** — Open the Camera app and scan the QR code (it will open in Expo Go)
4. The app will bundle and load on your device

### Running on Emulator/Simulator

- Press **`a`** in the terminal to open on an Android emulator
- Press **`i`** in the terminal to open on an iOS simulator (macOS only)
- Press **`w`** to open in the web browser

### Running on Snack Expo

1. Go to [snack.expo.dev](https://snack.expo.dev)
2. Upload all project files maintaining the same folder structure
3. Ensure all dependencies listed in `package.json` are added
4. The app will run directly in the browser preview or on a connected device

---

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.8",
  "@react-navigation/native-stack": "^7.12.0",
  "expo": "~54.0.33",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

---

## 🧭 Navigation Flow

```
MainFeedScreen (Home)
 ├── RecipeDetailScreen  ← tap any recipe card
 ├── FavoritesScreen     ← tap heart icon in header
 └── MyRecipesScreen     ← tap "My Food" category
      ├── RecipeDetailScreen  ← tap a user recipe
      ├── AddRecipeScreen     ← tap "+" button in header
      └── EditRecipeScreen    ← tap "Edit" button on a recipe
```

All screens support **back navigation** via the stack navigator header or custom back buttons.

---

## 📋 Assignment Checklist

| Requirement | Status |
|------------|--------|
| Expo (latest SDK) | ✅ SDK 54 |
| Functional components with hooks | ✅ useState, useCallback, useMemo, useLayoutEffect, useFocusEffect |
| React Navigation (stack) | ✅ Native Stack Navigator with 6 screens |
| Clean folder structure (/components, /screens, /navigation, /data, /utils) | ✅ |
| Comments explaining logic | ✅ Every file documented |
| Runs in Expo Go | ✅ Tested |
| Runs in Snack Expo | ✅ Compatible |
| Mock data with full details | ✅ 12 recipes across 9 categories |
| AsyncStorage for persistence | ✅ Favorites + user recipes |
| Reusable components | ✅ RecipeCard, CategoryItem |
| StyleSheet styling | ✅ All screens styled |
| Back navigation everywhere | ✅ Stack headers + custom back buttons |
| 6 screens (MainFeed, RecipeDetail, Favorites, MyRecipes, AddRecipe, EditRecipe) | ✅ |
| 10+ categories in horizontal FlatList | ✅ 11 categories in horizontal ScrollView |
| Category filtering | ✅ Tap category → filter recipes |
| Recipe detail (image, name, ingredients, instructions, prep time, servings, calories, difficulty) | ✅ |
| Heart icon favorite toggle | ✅ Persisted in AsyncStorage |
| My Food → MyRecipesScreen | ✅ |
| Edit and Delete buttons on user recipes | ✅ With confirmation dialog |
| Add recipe form (name, image URL, ingredients, instructions) | ✅ Full form with 8 fields |
| Edit recipe form | ✅ Pre-populated fields |
| Card layout with spacing | ✅ Shadow, rounded corners, badges |
| Icons from @expo/vector-icons | ✅ Ionicons throughout |

---

## 👤 Author

Built as an academic project demonstrating React Native Expo development with functional components, React Navigation, and AsyncStorage persistence.

---

## 📄 License

This project is for educational purposes.
