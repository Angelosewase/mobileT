# LexiTech Dictionary App - System Architecture

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Flow](#4-data-flow)
5. [API Integration](#5-api-integration)
6. [Application Screens](#6-application-screens)
7. [Components](#7-components)
8. [State Management](#8-state-management)
9. [Storage Layer](#9-storage-layer)
10. [Theming System](#10-theming-system)
11. [Error Handling](#11-error-handling)

---

## 1. Overview

LexiTech Dictionary is a cross-platform mobile application built with React Native and Expo SDK 56. The app allows users to search for English words, view definitions, listen to pronunciations, and track their learning progress.

### Key Features

| Feature | Description |
|---------|-------------|
| Word Search | Search English words with input validation |
| Definitions | View meanings, parts of speech, examples |
| Pronunciation | Audio playback with speed controls |
| Search History | Track and revisit previous searches |
| Gamification | Streak tracking, word count statistics |
| Dark Mode | System, light, and dark theme support |
| Onboarding | Personalized user profile setup |

---

## 2. Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.85.3 | Cross-platform mobile framework |
| Expo SDK | 56.0.8 | Development platform & native APIs |
| TypeScript | 6.0.3 | Type-safe JavaScript |
| React | 19.2.3 | UI component library |

### Navigation & UI

| Library | Version | Purpose |
|---------|---------|---------|
| expo-router | 56.2.8 | File-based routing |
| react-native-gesture-handler | 2.31.1 | Touch gestures |
| react-native-reanimated | 4.3.1 | Animations |
| nativewind | 4.2.4 | Tailwind CSS for React Native |
| react-native-svg | 15.15.5 | SVG illustrations |

### Data & Storage

| Library | Version | Purpose |
|---------|---------|---------|
| axios | 1.17.0 | HTTP client for API calls |
| expo-secure-store | 56.0.4 | Secure persistent storage |

### Media & Feedback

| Library | Version | Purpose |
|---------|---------|---------|
| expo-audio | 56.0.11 | Audio playback |
| expo-haptics | 56.0.3 | Haptic feedback |
| @expo/vector-icons | 15.1.1 | Icon library |

---

## 3. Project Structure

```
mobileT/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── _layout.tsx         # Root layout with providers
│   │   └── index.tsx           # Main search screen
│   │
│   ├── components/             # Reusable UI components
│   │   ├── onboarding/         # Onboarding flow screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── NameScreen.tsx
│   │   │   ├── GoalScreen.tsx
│   │   │   ├── InterestsScreen.tsx
│   │   │   ├── CompletionScreen.tsx
│   │   │   └── Onboarding.tsx
│   │   │
│   │   ├── AudioButton.tsx     # Audio player with controls
│   │   ├── AudioWave.tsx       # Animated wave visualization
│   │   ├── ErrorState.tsx      # Error display component
│   │   ├── HistoryDrawer.tsx   # Navigation drawer
│   │   ├── Illustrations.tsx   # SVG illustrations
│   │   ├── SearchBar.tsx       # Search input component
│   │   ├── SwipeableHistoryItem.tsx
│   │   ├── Toast.tsx           # Toast notifications
│   │   └── WordDetails.tsx     # Word definition display
│   │
│   ├── context/                # React Context providers
│   │   ├── DictionaryContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── UserContext.tsx
│   │
│   ├── services/               # API & external services
│   │   ├── dictionaryApi.ts    # Free Dictionary API client
│   │   └── wordOfTheDay.ts     # Word of the day data
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── dictionary.ts       # API response types
│   │
│   ├── utils/                  # Utility functions
│   │   ├── haptics.ts          # Haptic feedback helpers
│   │   ├── phonetics.ts        # Audio URL extraction
│   │   ├── storage.ts          # Persistent storage wrapper
│   │   └── validation.ts       # Input validation
│   │
│   └── global.css              # Global Tailwind styles
│
├── docs/                       # Documentation
│   ├── VERBIVY_DESIGN_GUIDE.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── DATA_FLOW_DIAGRAM.drawio
│
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 4. Data Flow

### 4.1 Search Flow

```
┌─────────┐    ┌───────────┐    ┌─────────────┐    ┌─────────────┐
│  User   │───▶│ SearchBar │───▶│ Validation  │───▶│ API Request │
└─────────┘    └───────────┘    └─────────────┘    └─────────────┘
                                       │                   │
                                       ▼                   ▼
                               ┌─────────────┐    ┌─────────────┐
                               │ Show Error  │    │ Parse JSON  │
                               └─────────────┘    └─────────────┘
                                                         │
                                                         ▼
                               ┌─────────────┐    ┌─────────────┐
                               │ Update Stats│◀───│ Store Data  │
                               └─────────────┘    └─────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │ WordDetails │
                                                  └─────────────┘
```

### 4.2 Audio Playback Flow

```
┌─────────────┐    ┌───────────────┐    ┌─────────────┐
│ AudioButton │───▶│ expo-audio    │───▶│ Audio File  │
│  (tap)      │    │ useAudioPlayer│    │ (remote URL)│
└─────────────┘    └───────────────┘    └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌───────────────┐
│ AudioWave   │    │ Playback      │
│ Animation   │    │ State Updates │
└─────────────┘    └───────────────┘
```

### 4.3 State Flow

```
┌─────────────────────────────────────────────────────────┐
│                    App Root (_layout.tsx)               │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ ThemeProvider│  │UserProvider │  │DictionaryProvider│ │
│  │             │  │             │  │                 │  │
│  │ • mode      │  │ • profile   │  │ • query         │  │
│  │ • isDark    │  │ • isLoading │  │ • entries       │  │
│  │ • colors    │  │ • onboarded │  │ • history       │  │
│  │             │  │             │  │ • stats         │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 5. API Integration

### 5.1 Free Dictionary API

**Base URL:** `https://api.dictionaryapi.dev/api/v2/entries/en`

#### Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v2/entries/en/{word}` | Fetch word definition |

#### Request Example

```typescript
GET https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

#### Response Structure

```typescript
interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
}

interface Phonetic {
  text?: string;      // e.g., "/həˈloʊ/"
  audio?: string;     // URL to MP3 file
  sourceUrl?: string;
}

interface Meaning {
  partOfSpeech: string;  // "noun", "verb", "adjective"
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}
```

#### Error Response (404)

```typescript
interface DictionaryApiErrorResponse {
  title?: string;
  message?: string;
  resolution?: string;
}
```

### 5.2 API Client Implementation

**File:** `src/services/dictionaryApi.ts`

```typescript
export async function fetchWordDefinition(word: string): Promise<DictionaryEntry[]>
```

**Features:**
- URL encoding for special characters
- 15-second timeout
- Type validation of response
- Error mapping to user-friendly messages

**Error Codes:**

| Code | Cause | User Message |
|------|-------|--------------|
| NOT_FOUND | 404 response | "We couldn't find definitions for that word" |
| NETWORK | No response | "Unable to reach the dictionary" |
| MALFORMED | Invalid JSON | "The dictionary returned an unexpected response" |
| UNKNOWN | Other errors | "An unexpected error occurred" |

---

## 6. Application Screens

### 6.1 Onboarding Flow

| Screen | Purpose | Data Collected |
|--------|---------|----------------|
| **WelcomeScreen** | Introduction, theme selection | Theme preference |
| **NameScreen** | User personalization | User name |
| **GoalScreen** | Learning intensity | Learning goal, daily word count |
| **InterestsScreen** | Topic preferences | Interest categories |
| **CompletionScreen** | Confirmation, celebration | - |

#### Onboarding Data Model

```typescript
interface UserProfile {
  name: string;
  learningGoal: "casual" | "regular" | "serious" | "intensive";
  interests: Interest[];
  dailyWordGoal: number;
  hasCompletedOnboarding: boolean;
  createdAt: string;
}
```

### 6.2 Main Screen (index.tsx)

**States:**

| State | UI Display |
|-------|------------|
| Empty | Word of Day, Quick Facts, Suggestions |
| Loading | Animated loader with message |
| Error | Error card with retry button |
| Results | Word details with audio player |

**Sections:**

1. **Header** - Greeting, stats, streak badge
2. **Search Bar** - Input with validation
3. **Word of the Day** - Featured word card
4. **Recent Searches** - Horizontal scroll chips
5. **Quick Fact** - Language trivia
6. **Word Details** - Definition display (when searched)

### 6.3 History Drawer

**Sections:**

1. **Header** - App logo, user greeting
2. **Stats Card** - Words found, streak
3. **Recent Searches** - Swipeable list
4. **Settings** - Reset all data option
5. **Footer** - API attribution

---

## 7. Components

### 7.1 Core Components

| Component | Props | Purpose |
|-----------|-------|---------|
| `SearchBar` | initialValue, loading, onSearch | Word input with validation |
| `WordDetails` | entries | Display definitions |
| `AudioButton` | audioUrl, label, compact | Audio playback |
| `AudioWave` | isPlaying, barCount, colors | Wave animation |
| `ErrorState` | error, onRetry | Error display |
| `Toast` | visible, message, type, onHide | Notifications |
| `HistoryDrawer` | navigation | Side drawer |
| `SwipeableHistoryItem` | word, onPress, onDelete | Swipe-to-delete |

### 7.2 Illustrations (SVG)

| Component | Usage |
|-----------|-------|
| `BookIllustration` | Empty state |
| `SuccessIllustration` | Completion screens |
| `SearchIllustration` | Word not found |
| `ErrorIllustration` | Error states |
| `EmptyHistoryIllustration` | Empty history |
| `StreakFlame` | Streak indicator |

### 7.3 Onboarding Components

| Component | Screen | Key Features |
|-----------|--------|--------------|
| `WelcomeScreen` | 1 | Logo animation, theme toggle, features |
| `NameScreen` | 2 | Text input, validation |
| `GoalScreen` | 3 | 4-option selector |
| `InterestsScreen` | 4 | Multi-select grid |
| `CompletionScreen` | 5 | Confetti, summary |

---

## 8. State Management

### 8.1 DictionaryContext

**File:** `src/context/DictionaryContext.tsx`

```typescript
interface DictionaryContextValue {
  // Search State
  query: string;
  entries: DictionaryEntry[] | null;
  loading: boolean;
  error: DictionaryError | null;
  
  // History
  history: string[];
  
  // Gamification
  stats: GamificationStats;
  justFoundWord: boolean;
  
  // Actions
  searchWord: (word: string) => Promise<void>;
  retry: () => void;
  clearSearch: () => void;
  removeFromHistory: (word: string) => void;
  clearHistory: () => void;
  resetStats: () => void;
  clearJustFound: () => void;
}
```

**Gamification Stats:**

```typescript
interface GamificationStats {
  totalSearches: number;
  successfulSearches: number;
  currentStreak: number;
  bestStreak: number;
  lastSearchDate: string | null;
}
```

### 8.2 ThemeContext

**File:** `src/context/ThemeContext.tsx`

```typescript
interface ThemeContextValue {
  mode: "light" | "dark" | "system";
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  colors: ColorPalette;
}
```

**Color Tokens:**

| Token | Light | Dark |
|-------|-------|------|
| background | #FFFFFF | #000000 |
| surface | #FFFFFF | #1C1C1E |
| text | #000000 | #FFFFFF |
| textSecondary | #6B6B70 | #AEAEB2 |
| border | #E5E5EA | #38383A |
| lavender | #E8DFF5 | #2D2640 |
| purple | #9B7FD4 | #B19CD9 |

### 8.3 UserContext

**File:** `src/context/UserContext.tsx`

```typescript
interface UserContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  resetProfile: () => Promise<void>;
}
```

---

## 9. Storage Layer

### 9.1 Storage Utility

**File:** `src/utils/storage.ts`

```typescript
// Cross-platform storage wrapper
export async function getItem(key: string): Promise<string | null>;
export async function setItem(key: string, value: string): Promise<void>;
export async function removeItem(key: string): Promise<void>;
```

**Platform Implementation:**

| Platform | Storage Backend |
|----------|-----------------|
| iOS | expo-secure-store |
| Android | expo-secure-store |
| Web | localStorage |

### 9.2 Storage Keys

| Key | Data | Context |
|-----|------|---------|
| `lexitech_theme` | Theme mode | ThemeContext |
| `lexitech_user_profile` | User profile JSON | UserContext |

---

## 10. Theming System

### 10.1 Design Tokens

**Based on:** Verbivy Design Guide

```javascript
// tailwind.config.js
colors: {
  verbivy: {
    black: "#000000",
    white: "#FFFFFF",
    lavender: "#E8DFF5",
    "lavender-strong": "#C9B8E8",
    purple: "#9B7FD4",
    peach: "#FFE8D9",
    mint: "#D4F0E4",
    border: "#E5E5EA",
    "text-secondary": "#6B6B70",
    "text-tertiary": "#AEAEB2",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
  },
}
```

### 10.2 Theme Modes

| Mode | Behavior |
|------|----------|
| Light | Always light colors |
| Dark | Always dark colors |
| System | Follows device setting |

### 10.3 Component Theming

Components use `useTheme()` hook:

```typescript
const { colors, isDark } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>
```

---

## 11. Error Handling

### 11.1 API Errors

| Error Type | Detection | User Action |
|------------|-----------|-------------|
| Network | No response | Check connection, retry |
| Not Found | 404 status | Try different spelling |
| Malformed | Invalid JSON | Retry |
| Unknown | Other | Retry |

### 11.2 Input Validation

**File:** `src/utils/validation.ts`

| Rule | Regex/Logic | Error Message |
|------|-------------|---------------|
| Empty | `length === 0` | "Please enter a word" |
| Too short | `length < 2` | "At least 2 characters" |
| Has numbers | `/\d/` | "Words cannot contain numbers" |
| Invalid chars | `/[^a-zA-Z\-'\s]/` | "Only letters allowed" |

### 11.3 Haptic Feedback

| Event | Haptic Type |
|-------|-------------|
| Button press | Light impact |
| Search submit | Medium impact |
| Success | Success notification |
| Error | Error notification |
| Selection | Selection feedback |

---

## Appendix A: Running the Application

### Development

```bash
# Install dependencies
pnpm install

# Start Expo dev server
pnpm start

# Run on specific platform
pnpm android
pnpm ios
pnpm web
```

### Building

```bash
# Build for production
npx expo build:android
npx expo build:ios
```

---

## Appendix B: Environment Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | ≥18.0.0 |
| pnpm | ≥8.0.0 |
| Expo CLI | Latest |
| iOS Simulator | Xcode 15+ |
| Android Emulator | API 33+ |

---

*Document Version: 1.0*  
*Last Updated: June 8, 2026*  
*Author: LexiTech Solutions Ltd*
