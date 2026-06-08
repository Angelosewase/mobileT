import "../global.css";

import { Ionicons } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HistoryDrawer } from "../components/HistoryDrawer";
import { Onboarding } from "../components/onboarding/Onboarding";
import { DictionaryProvider } from "../context/DictionaryContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { UserProvider, useUser } from "../context/UserContext";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoading, hasCompletedOnboarding } = useUser();
  const { colors, isDark } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isReady) {
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex-1 items-center justify-center"
      >
        <View
          style={{ backgroundColor: colors.lavender }}
          className="h-24 w-24 items-center justify-center rounded-3xl"
        >
          <Ionicons name="book" size={48} color={colors.purple} />
        </View>
        <View className="absolute bottom-20">
          <ActivityIndicator size="small" color={colors.purple} />
        </View>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <DictionaryProvider>
      <Drawer
        drawerContent={(props) => <HistoryDrawer {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: colors.background,
            width: 300,
          },
          drawerActiveTintColor: colors.text,
          drawerInactiveTintColor: colors.textSecondary,
          headerRight: () => (
            <View className="mr-4 flex-row items-center gap-3">
              <ThemeToggle />
            </View>
          ),
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "LexiTech Dictionary",
            drawerLabel: "Search",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </DictionaryProvider>
  );
}

function ThemeToggle() {
  const { mode, setMode, colors, isDark } = useTheme();

  const handleToggle = () => {
    if (mode === "light") {
      setMode("dark");
    } else if (mode === "dark") {
      setMode("system");
    } else {
      setMode("light");
    }
  };

  const icon = mode === "light" ? "sunny" : mode === "dark" ? "moon" : "contrast";

  return (
    <View
      style={{ backgroundColor: colors.backgroundSubtle }}
      className="h-9 w-9 items-center justify-center rounded-full"
    >
      <Ionicons
        name={icon}
        size={18}
        color={colors.textSecondary}
        onPress={handleToggle}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
