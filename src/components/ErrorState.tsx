import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";
import type { DictionaryError } from "../types/dictionary";
import { lightImpact, mediumImpact } from "../utils/haptics";
import { ErrorIllustration, SearchIllustration } from "./Illustrations";

interface ErrorStateProps {
  error: DictionaryError;
  onRetry?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    void lightImpact();
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleRetry = () => {
    void mediumImpact();
    onRetry?.();
  };

  const isNotFound = error.code === "NOT_FOUND";
  const isNetwork = error.code === "NETWORK";

  const title = isNotFound
    ? "Word not found"
    : isNetwork
      ? "Connection problem"
      : "Something went wrong";

  const icon = isNotFound ? "search" : isNetwork ? "cloud-offline" : "warning";

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      className="items-center gap-5 rounded-3xl border p-6"
    >
      {/* Illustration */}
      {isNotFound ? (
        <SearchIllustration size={100} />
      ) : (
        <ErrorIllustration size={100} />
      )}

      {/* Title and message */}
      <View className="items-center gap-2">
        <View className="flex-row items-center gap-2">
          <Ionicons
            name={icon as any}
            size={20}
            color={isNotFound ? colors.purple : colors.warning}
          />
          <Text style={{ color: colors.text }} className="text-xl font-semibold">
            {title}
          </Text>
        </View>

        <Text
          style={{ color: colors.textSecondary }}
          className="text-center text-base leading-6"
        >
          {error.message}
        </Text>

        {error.resolution && (
          <View
            style={{ backgroundColor: `${colors.lavender}50` }}
            className="mt-1 flex-row items-start gap-2 rounded-xl px-4 py-3"
          >
            <Ionicons
              name="bulb-outline"
              size={16}
              color={colors.purple}
              style={{ marginTop: 2 }}
            />
            <Text
              style={{ color: colors.textSecondary }}
              className="flex-1 text-sm leading-5"
            >
              {error.resolution}
            </Text>
          </View>
        )}
      </View>

      {/* Suggestions for not found */}
      {isNotFound && (
        <View className="w-full gap-2">
          <Text
            style={{ color: colors.textTertiary }}
            className="text-center text-xs font-medium uppercase tracking-wide"
          >
            Suggestions
          </Text>
          <View className="gap-2">
            <View
              style={{ backgroundColor: `${colors.lavender}30` }}
              className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.purple} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                Check the spelling of your word
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${colors.lavender}30` }}
              className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.purple} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                Try a simpler or related word
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Network error tips */}
      {isNetwork && (
        <View className="w-full gap-2">
          <Text
            style={{ color: colors.textTertiary }}
            className="text-center text-xs font-medium uppercase tracking-wide"
          >
            Troubleshooting
          </Text>
          <View className="gap-2">
            <View
              style={{ backgroundColor: `${colors.peach}50` }}
              className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
            >
              <Ionicons name="wifi" size={16} color={colors.warning} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                Check your internet connection
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${colors.peach}50` }}
              className="flex-row items-center gap-2 rounded-xl px-4 py-2.5"
            >
              <Ionicons name="refresh" size={16} color={colors.warning} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                Try again in a few moments
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Retry button */}
      {onRetry && (
        <AnimatedPressable
          onPress={handleRetry}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel="Retry search"
          style={[
            buttonAnimatedStyle,
            {
              backgroundColor: `${colors.lavender}50`,
              borderColor: colors.purple,
            },
          ]}
          className="mt-2 h-12 w-full flex-row items-center justify-center gap-2 rounded-full border-2"
        >
          <Ionicons name="refresh" size={18} color={colors.purple} />
          <Text style={{ color: colors.purple }} className="text-base font-semibold">
            Try again
          </Text>
        </AnimatedPressable>
      )}
    </Animated.View>
  );
}
