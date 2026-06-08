import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorState } from "../components/ErrorState";
import { BookIllustration, StreakFlame } from "../components/Illustrations";
import { SearchBar } from "../components/SearchBar";
import { Toast } from "../components/Toast";
import { WordDetails } from "../components/WordDetails";
import { useDictionary } from "../context/DictionaryContext";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { getDailyFact, getWordOfTheDay } from "../services/wordOfTheDay";
import { lightImpact } from "../utils/haptics";
import { QUICK_SEARCH_WORDS } from "../utils/validation";

export default function Index() {
  const { colors } = useTheme();
  const { profile } = useUser();
  const {
    query,
    entries,
    loading,
    error,
    history,
    stats,
    justFoundWord,
    searchWord,
    retry,
    clearJustFound,
    clearSearch,
  } = useDictionary();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSubtitle, setToastSubtitle] = useState("");

  const wordOfTheDay = useMemo(() => getWordOfTheDay(), []);
  const dailyFact = useMemo(() => getDailyFact(), []);

  useEffect(() => {
    if (justFoundWord && entries) {
      setToastMessage("Found it!");
      setToastSubtitle(
        `${entries[0].meanings.length} meaning${entries[0].meanings.length !== 1 ? "s" : ""} discovered`,
      );
      setShowToast(true);
    }
  }, [justFoundWord, entries]);

  const handleHideToast = useCallback(() => {
    setShowToast(false);
    clearJustFound();
  }, [clearJustFound]);

  const handleWordOfDayPress = () => {
    void lightImpact();
    void searchWord(wordOfTheDay.word);
  };

  const handleHistoryItemPress = (word: string) => {
    void lightImpact();
    void searchWord(word);
  };

  const handleNewSearch = () => {
    void lightImpact();
    clearSearch();
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const showHomeContent = !loading && !error && !entries;
  const showResults = !loading && (error || entries);

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["bottom"]}
    >
      {/* Toast Notification */}
      <Toast
        visible={showToast}
        message={toastMessage}
        subtitle={toastSubtitle}
        type="success"
        duration={2500}
        onHide={handleHideToast}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 24, paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(400)} className="gap-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              {profile?.name ? (
                <Text style={{ color: colors.textSecondary }} className="text-base">
                  {greeting}, {profile.name}
                </Text>
              ) : null}
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold tracking-tight"
              >
                Discover Words
              </Text>
            </View>

            {/* Streak Badge */}
            {stats.currentStreak > 0 && (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={{ backgroundColor: colors.lavender }}
                className="flex-row items-center gap-1.5 rounded-full px-3 py-2"
              >
                <StreakFlame size={18} />
                <Text style={{ color: colors.text }} className="text-sm font-semibold">
                  {stats.currentStreak}
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Stats Row */}
          {stats.totalSearches > 0 && (
            <Animated.View
              entering={FadeIn.delay(200).duration(300)}
              className="flex-row gap-4 pt-1"
            >
              <View className="flex-row items-center gap-1.5">
                <View
                  style={{ backgroundColor: colors.success }}
                  className="h-2 w-2 rounded-full"
                />
                <Text style={{ color: colors.textSecondary }} className="text-sm">
                  {stats.successfulSearches} words found
                </Text>
              </View>
              {stats.bestStreak > 1 && (
                <View className="flex-row items-center gap-1.5">
                  <StreakFlame size={14} />
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Best: {stats.bestStreak}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        </Animated.View>

        {/* Search Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <SearchBar
            key={query}
            initialValue={query}
            loading={loading}
            history={history}
            onSearch={searchWord}
          />
        </Animated.View>

        {/* New Search Button - Show when results are displayed */}
        {showResults && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Pressable
              onPress={handleNewSearch}
              style={{
                backgroundColor: colors.backgroundSubtle,
                borderColor: colors.border,
              }}
              className="flex-row items-center justify-center gap-2 rounded-full border py-3"
            >
              <Ionicons name="refresh" size={18} color={colors.purple} />
              <Text style={{ color: colors.purple }} className="text-sm font-semibold">
                New Search
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Loading State */}
        {loading && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="items-center gap-4 py-12"
          >
            <View
              style={{ backgroundColor: `${colors.lavender}80` }}
              className="rounded-full p-6"
            >
              <ActivityIndicator size="large" color={colors.purple} />
            </View>
            <View className="items-center gap-1">
              <Text style={{ color: colors.text }} className="text-lg font-semibold">
                Looking it up...
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-base">
                Finding the best definitions for you
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Error State */}
        {!loading && error && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <ErrorState error={error} onRetry={retry} />
          </Animated.View>
        )}

        {/* Word Details */}
        {!loading && !error && entries && (
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <WordDetails entries={entries} />
          </Animated.View>
        )}

        {/* Home Content - Word of Day, Recent, Facts */}
        {showHomeContent && (
          <>
            {/* Word of the Day Card */}
            <Animated.View entering={FadeIn.delay(300).duration(500)}>
              <Pressable
                onPress={handleWordOfDayPress}
                style={{ backgroundColor: colors.lavender }}
                className="overflow-hidden rounded-3xl"
              >
                <View className="flex-row items-center gap-2 px-5 pt-4">
                  <Ionicons name="sparkles" size={18} color={colors.purple} />
                  <Text style={{ color: colors.purple }} className="text-sm font-semibold">
                    Word of the Day
                  </Text>
                </View>
                <View className="gap-2 p-5 pt-3">
                  <Text style={{ color: colors.text }} className="text-2xl font-bold">
                    {wordOfTheDay.word}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <View
                      style={{ backgroundColor: `${colors.purple}30` }}
                      className="rounded-full px-2 py-0.5"
                    >
                      <Text style={{ color: colors.purple }} className="text-xs font-medium">
                        {wordOfTheDay.partOfSpeech}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{ color: colors.textSecondary }}
                    className="text-base leading-6"
                    numberOfLines={2}
                  >
                    {wordOfTheDay.definition}
                  </Text>
                  {wordOfTheDay.funFact && (
                    <View
                      style={{ backgroundColor: `${colors.background}80` }}
                      className="mt-2 flex-row items-start gap-2 rounded-xl p-3"
                    >
                      <Ionicons name="bulb" size={16} color={colors.warning} />
                      <Text
                        style={{ color: colors.textSecondary }}
                        className="flex-1 text-sm"
                      >
                        {wordOfTheDay.funFact}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{ backgroundColor: colors.purple }}
                  className="flex-row items-center justify-center gap-2 py-3"
                >
                  <Text className="text-sm font-semibold text-white">
                    Tap to explore
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              </Pressable>
            </Animated.View>

            {/* Recent Searches */}
            {history.length > 0 && (
              <Animated.View entering={FadeIn.delay(400).duration(500)} className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: colors.text }} className="text-lg font-semibold">
                    Recent Searches
                  </Text>
                  <Text style={{ color: colors.textTertiary }} className="text-sm">
                    {history.length} word{history.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {history.slice(0, 8).map((word) => (
                    <Pressable
                      key={word}
                      onPress={() => handleHistoryItemPress(word)}
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      }}
                      className="flex-row items-center gap-2 rounded-full border px-4 py-2.5"
                    >
                      <View
                        style={{ backgroundColor: colors.lavender }}
                        className="h-6 w-6 items-center justify-center rounded-full"
                      >
                        <Text
                          style={{ color: colors.purple }}
                          className="text-xs font-semibold uppercase"
                        >
                          {word.charAt(0)}
                        </Text>
                      </View>
                      <Text style={{ color: colors.text }} className="text-sm font-medium capitalize">
                        {word}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </Animated.View>
            )}

            {/* Quick Fact Card */}
            <Animated.View entering={FadeIn.delay(500).duration(500)}>
              <View
                style={{
                  backgroundColor: colors.mint,
                  borderColor: colors.success,
                }}
                className="rounded-2xl border p-4"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name={dailyFact.icon as any} size={20} color={colors.success} />
                  <Text style={{ color: colors.success }} className="text-sm font-semibold">
                    {dailyFact.title}
                  </Text>
                </View>
                <Text
                  style={{ color: colors.text }}
                  className="mt-2 text-base leading-6"
                >
                  {dailyFact.content}
                </Text>
              </View>
            </Animated.View>

            {/* Empty State / Suggestions */}
            {history.length === 0 && (
              <Animated.View
                entering={FadeIn.delay(600).duration(500)}
                className="items-center gap-6 py-4"
              >
                <BookIllustration size={120} />
                <View className="items-center gap-2 px-4">
                  <Text
                    style={{ color: colors.text }}
                    className="text-center text-xl font-semibold"
                  >
                    Ready to explore?
                  </Text>
                  <Text
                    style={{ color: colors.textSecondary }}
                    className="text-center text-base leading-6"
                  >
                    Type any English word to discover its meaning and
                    pronunciation.
                  </Text>
                </View>

                {/* Quick suggestions */}
                <View className="w-full gap-2">
                  <Text
                    style={{ color: colors.textTertiary }}
                    className="text-center text-sm font-medium"
                  >
                    Try these words
                  </Text>
                  <View className="flex-row flex-wrap justify-center gap-2">
                    {QUICK_SEARCH_WORDS.map((word) => (
                      <Pressable
                        key={word}
                        onPress={() => handleHistoryItemPress(word)}
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        }}
                        className="rounded-full border px-4 py-2"
                      >
                        <Text
                          style={{ color: colors.purple }}
                          className="text-sm font-medium capitalize"
                        >
                          {word}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
