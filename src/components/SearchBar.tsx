import { Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
import { extractFirstWord, getValidationError } from "../utils/validation";
import {
  getSuggestionQuery,
  getWordSuggestions,
  splitSuggestionMatch,
  type WordSuggestion,
} from "../utils/wordSuggestions";

interface SearchBarProps {
  initialValue?: string;
  loading?: boolean;
  history?: string[];
  onSearch: (word: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SuggestionRow({
  suggestion,
  query,
  onPress,
}: {
  suggestion: WordSuggestion;
  query: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { prefix, remainder } = splitSuggestionMatch(query, suggestion.word);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? `${colors.lavender}80` : colors.surface,
      })}
      className="flex-row items-center gap-3 px-4 py-3"
      accessibilityRole="button"
      accessibilityLabel={`Search for ${suggestion.word}`}
    >
      <Ionicons
        name={suggestion.source === "history" ? "time-outline" : "search"}
        size={18}
        color={colors.textTertiary}
      />
      <Text className="flex-1 text-base">
        <Text style={{ color: colors.text, fontWeight: "600" }}>{prefix}</Text>
        <Text style={{ color: colors.textSecondary }}>{remainder}</Text>
      </Text>
      {suggestion.source === "history" ? (
        <Text style={{ color: colors.textTertiary }} className="text-xs">
          Recent
        </Text>
      ) : null}
    </Pressable>
  );
}

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
  const selectingSuggestionRef = useRef(false);

  const buttonScale = useSharedValue(1);
  const inputShake = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: inputShake.value }],
  }));

  const suggestionQuery = useMemo(() => getSuggestionQuery(value), [value]);

  const suggestions = useMemo(
    () => getWordSuggestions(value, history),
    [value, history],
  );

  const firstWordSuggestion = useMemo(
    () => (/\s/.test(value.trim()) ? extractFirstWord(value) : null),
    [value],
  );

  const showSuggestions =
    isFocused &&
    suggestionQuery.length >= 1 &&
    suggestions.length > 0 &&
    !validationError;

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

  const handleSearch = (word?: string) => {
    const trimmed = (typeof word === "string" ? word : value).trim();
    const error = getValidationError(trimmed);

    if (error) {
      setValidationError(error);
      shakeInput();
      return;
    }

    setValidationError(null);
    setIsFocused(false);
    void mediumImpact();
    onSearch(trimmed);
  };

  const handleSuggestionPress = (word: string) => {
    selectingSuggestionRef.current = true;
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

  const handleBlur = () => {
    setTimeout(() => {
      if (!selectingSuggestionRef.current) {
        setIsFocused(false);
      }
      selectingSuggestionRef.current = false;
    }, 150);
  };

  const borderColor = isFocused
    ? colors.purple
    : validationError
      ? colors.error
      : colors.border;

  return (
    <View className="gap-3">
      <Animated.View style={inputAnimatedStyle}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor,
            borderWidth: 2,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <View className="flex-row items-center gap-3 px-4 py-3">
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
              onBlur={handleBlur}
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
            {value.length > 0 && !loading ? (
              <Pressable
                onPress={() => {
                  setValue("");
                  setValidationError(null);
                  void lightImpact();
                }}
                hitSlop={8}
                accessibilityLabel="Clear search"
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textTertiary}
                />
              </Pressable>
            ) : null}
          </View>

          {showSuggestions ? (
            <Animated.View entering={FadeIn.duration(150)}>
              <View style={{ backgroundColor: colors.border, height: 1 }} />
              {suggestions.map((suggestion, index) => (
                <View key={`${suggestion.source}-${suggestion.word}`}>
                  <SuggestionRow
                    suggestion={suggestion}
                    query={suggestionQuery}
                    onPress={() => handleSuggestionPress(suggestion.word)}
                  />
                  {index < suggestions.length - 1 ? (
                    <View
                      style={{
                        backgroundColor: colors.border,
                        height: 1,
                        marginLeft: 46,
                      }}
                    />
                  ) : null}
                </View>
              ))}
            </Animated.View>
          ) : null}
        </View>
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
              <Ionicons
                name="arrow-forward-circle"
                size={16}
                color={colors.purple}
              />
              <Text style={{ color: colors.purple }} className="text-sm font-medium">
                Search for &quot;{firstWordSuggestion}&quot; instead
              </Text>
            </Pressable>
          ) : null}
        </View>
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
