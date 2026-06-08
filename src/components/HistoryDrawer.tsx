import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDictionary } from "../context/DictionaryContext";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { lightImpact, mediumImpact, errorNotification } from "../utils/haptics";
import { EmptyHistoryIllustration, StreakFlame } from "./Illustrations";
import { SwipeableHistoryItem } from "./SwipeableHistoryItem";

interface HistoryDrawerProps {
  navigation: {
    closeDrawer: () => void;
  };
}

export function HistoryDrawer(props: HistoryDrawerProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { profile, resetProfile } = useUser();
  const { history, stats, searchWord, loading, removeFromHistory, clearHistory, resetStats } =
    useDictionary();
  const [showDangerZone, setShowDangerZone] = useState(false);

  const handleSelect = (word: string) => {
    props.navigation.closeDrawer();
    void searchWord(word);
  };

  const handleDeleteItem = (word: string) => {
    removeFromHistory(word);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "This will remove all your search history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            void errorNotification();
            clearHistory();
          },
        },
      ],
    );
  };

  const handleResetAllData = () => {
    Alert.alert(
      "Reset All Data",
      "This will clear all your data and take you back to the onboarding screen. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Everything",
          style: "destructive",
          onPress: async () => {
            void errorNotification();
            clearHistory();
            resetStats();
            await resetProfile();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} className="px-5 pb-5">
        <View className="flex-row items-center gap-3">
          <View
            style={{ backgroundColor: colors.lavender }}
            className="h-12 w-12 items-center justify-center rounded-2xl"
          >
            <Ionicons name="book" size={24} color={colors.purple} />
          </View>
          <View>
            <Text
              style={{ color: colors.text }}
              className="text-2xl font-bold tracking-tight"
            >
              LexiTech
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm">
              {profile?.name ? `Hi, ${profile.name}` : "Dictionary App"}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats Card */}
      {stats.totalSearches > 0 && (
        <Animated.View
          entering={FadeIn.delay(100).duration(400)}
          style={{ backgroundColor: colors.lavender }}
          className="mx-4 mb-5 overflow-hidden rounded-2xl"
        >
          <View className="flex-row">
            <View
              style={{ borderColor: `${colors.border}50` }}
              className="flex-1 items-center gap-1 border-r py-4"
            >
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                {stats.successfulSearches}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">
                Words Found
              </Text>
            </View>
            <View className="flex-1 items-center gap-1 py-4">
              <View className="flex-row items-center gap-1">
                <StreakFlame size={20} />
                <Text style={{ color: colors.text }} className="text-2xl font-bold">
                  {stats.currentStreak}
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary }} className="text-xs">
                Day Streak
              </Text>
            </View>
          </View>
          {stats.bestStreak > stats.currentStreak && (
            <View
              style={{ backgroundColor: `${colors.background}50` }}
              className="border-t border-verbivy-border/50 py-2"
            >
              <Text
                style={{ color: colors.textTertiary }}
                className="text-center text-xs"
              >
                Personal best: {stats.bestStreak} days
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      <View
        style={{ backgroundColor: colors.border }}
        className="mx-4 mb-4 h-px"
      />

      {/* History Section */}
      <View className="flex-1 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
            <Text style={{ color: colors.text }} className="text-base font-semibold">
              Recent Searches
            </Text>
          </View>
          {history.length > 0 && (
            <Pressable
              onPress={() => {
                void lightImpact();
                handleClearHistory();
              }}
              className="flex-row items-center gap-1"
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={{ color: colors.error }} className="text-sm">
                Clear
              </Text>
            </Pressable>
          )}
        </View>

        {history.length === 0 ? (
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            className="items-center gap-4 py-8"
          >
            <EmptyHistoryIllustration size={100} />
            <View className="items-center gap-2 px-2">
              <Text
                style={{ color: colors.text }}
                className="text-center text-base font-medium"
              >
                No searches yet
              </Text>
              <Text
                style={{ color: colors.textSecondary }}
                className="text-center text-sm leading-5"
              >
                Your recent lookups will appear here.
              </Text>
            </View>
          </Animated.View>
        ) : (
          <View className="gap-2">
            <Text style={{ color: colors.textTertiary }} className="mb-1 text-xs">
              Swipe left or long press to delete
            </Text>
            {history.map((word, index) => (
              <Animated.View
                key={word}
                entering={FadeInRight.delay(50 * index).duration(300)}
              >
                <SwipeableHistoryItem
                  word={word}
                  onPress={() => handleSelect(word)}
                  onDelete={() => handleDeleteItem(word)}
                  disabled={loading}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Danger Zone */}
      <View className="mt-6 px-4">
        <Pressable
          onPress={() => {
            void lightImpact();
            setShowDangerZone(!showDangerZone);
          }}
          className="flex-row items-center justify-between py-2"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
              Settings
            </Text>
          </View>
          <Ionicons
            name={showDangerZone ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textTertiary}
          />
        </Pressable>

        {showDangerZone && (
          <Animated.View entering={FadeIn.duration(300)} className="mt-2 gap-2">
            <Pressable
              onPress={() => {
                void mediumImpact();
                handleResetAllData();
              }}
              style={{ backgroundColor: `${colors.error}15` }}
              className="flex-row items-center gap-3 rounded-xl px-4 py-3"
            >
              <Ionicons name="refresh-circle" size={22} color={colors.error} />
              <View className="flex-1">
                <Text style={{ color: colors.error }} className="text-sm font-semibold">
                  Reset All Data
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs">
                  Clear everything and restart onboarding
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Footer */}
      <View className="mt-4 px-4">
        <View style={{ backgroundColor: colors.border }} className="h-px" />
        <View className="flex-row items-center justify-center gap-2 py-4">
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textTertiary}
          />
          <Text style={{ color: colors.textTertiary }} className="text-xs">
            Powered by Free Dictionary API
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
