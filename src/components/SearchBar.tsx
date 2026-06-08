import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";
import { lightImpact, mediumImpact } from "../utils/haptics";
import {
  extractFirstWord,
  getSearchSuggestions,
  getValidationError,
} from "../utils/validation";

interface SearchBarProps {
  initialValue?: string;
  loading?: boolean;
  history?: string[];
  onSearch: (word: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SearchBar({
  initialValue = "",
  loading = false,
  history = [],
  onSearch,
}: SearchBarProps) {
  const { colors } = useTheme();
  const [value, setValue] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const buttonScale = useSharedValue(1);
  const inputShake = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: inputShake.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    void lightImpact();
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const shakeInput = () => {
    inputShake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const suggestions = useMemo(
    () => getSearchSuggestions(value, history),
    [value, history],
  );

  const firstWordSuggestion = useMemo(
    () => (/\s/.test(value.trim()) ? extractFirstWord(value) : null),
    [value],
  );

  const handleSearch = (word?: string) => {
    const trimmed = (typeof word === "string" ? word : value).trim();
    const error = getValidationError(trimmed);

    if (error) {
      setValidationError(error);
      shakeInput();
      return;
    }

    setValidationError(null);
    void mediumImpact();
    onSearch(trimmed);
  };

  const handleSuggestionPress = (word: string) => {
    setValue(word);
    setValidationError(null);
    void lightImpact();
    handleSearch(word);
  };

  const handleTextChange = (text: string) => {
    setValue(text);
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <View className="gap-3">
      <Animated.View
        style={[
          inputAnimatedStyle,
          {
            backgroundColor: colors.surface,
            borderColor: isFocused
              ? colors.purple
              : validationError
                ? colors.error
                : colors.border,
          },
        ]}
        className="flex-row items-center gap-3 rounded-2xl border-2 px-4 py-3"
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? colors.purple : colors.textTertiary}
        />
        <TextInput
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={() => handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a word to explore..."
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          editable={!loading}
          style={{ color: colors.text }}
          className="flex-1 text-base"
          accessibilityLabel="Word search input"
        />
        {value.length > 0 && !loading && (
          <Pressable
            onPress={() => {
              setValue("");
              setValidationError(null);
              void lightImpact();
            }}
            hitSlop={8}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </Pressable>
        )}
      </Animated.View>

      {validationError ? (
        <View className="gap-2 px-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={16} color={colors.error} />
            <Text style={{ color: colors.error }} className="flex-1 text-sm">
              {validationError}
            </Text>
          </View>
          {firstWordSuggestion && validationError.includes("no spaces") ? (
            <Pressable
              onPress={() => handleSuggestionPress(firstWordSuggestion)}
              style={{
                backgroundColor: `${colors.lavender}50`,
                borderColor: colors.purple,
              }}
              className="flex-row items-center gap-2 self-start rounded-full border px-3 py-1.5"
              accessibilityLabel={`Search for ${firstWordSuggestion} instead`}
            >
              <Ionicons name="arrow-forward-circle" size={16} color={colors.purple} />
              <Text style={{ color: colors.purple }} className="text-sm font-medium">
                Search for &quot;{firstWordSuggestion}&quot; instead
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {isFocused && value.trim().length > 0 && suggestions.length > 0 && !validationError ? (
        <Animated.View entering={FadeIn.duration(200)} className="gap-2">
          <Text
            style={{ color: colors.textTertiary }}
            className="px-1 text-xs font-medium uppercase tracking-wide"
          >
            Suggestions
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8 }}
          >
            {suggestions.map((word) => (
              <Pressable
                key={word}
                onPress={() => handleSuggestionPress(word)}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="flex-row items-center gap-2 rounded-full border px-3 py-2"
                accessibilityLabel={`Search for ${word}`}
              >
                <Ionicons name="search" size={14} color={colors.purple} />
                <Text style={{ color: colors.text }} className="text-sm font-medium capitalize">
                  {word}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      ) : null}

      <AnimatedPressable
        onPress={() => handleSearch()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Search dictionary"
        style={[buttonAnimatedStyle, { opacity: loading ? 0.4 : 1 }]}
        className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
      >
        {loading ? (
          <View className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <Ionicons name="search" size={20} color="#FFFFFF" />
        )}
        <Text className="text-base font-semibold text-white">
          {loading ? "Searching..." : "Search Dictionary"}
        </Text>
      </AnimatedPressable>

      <Text style={{ color: colors.textTertiary }} className="text-center text-sm">
        Explore definitions, examples, and pronunciations
      </Text>
    </View>
  );
}
