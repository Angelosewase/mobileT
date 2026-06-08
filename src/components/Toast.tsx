import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  runOnJS,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

interface ToastProps {
  visible: boolean;
  message: string;
  subtitle?: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onHide: () => void;
}

export function Toast({
  visible,
  message,
  subtitle,
  type = "success",
  duration = 2500,
  onHide,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const progress = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      progress.value = 1;
      progress.value = withDelay(
        200,
        withTiming(0, { duration: duration - 200 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        }),
      );
    }
  }, [visible, duration, onHide, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!visible) return null;

  const iconName =
    type === "success"
      ? "checkmark-circle"
      : type === "error"
        ? "alert-circle"
        : "information-circle";

  const iconColor =
    type === "success"
      ? colors.success
      : type === "error"
        ? colors.error
        : colors.purple;

  const progressColor =
    type === "success"
      ? colors.success
      : type === "error"
        ? colors.error
        : colors.purple;

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18).stiffness(200)}
      exiting={SlideOutUp.duration(200)}
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <View
        style={{ backgroundColor: isDark ? colors.surfaceElevated : colors.surface }}
        className="overflow-hidden rounded-2xl border border-verbivy-border shadow-lg"
      >
        <View className="flex-row items-center gap-3 px-4 py-3">
          <View
            style={{ backgroundColor: `${iconColor}20` }}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Ionicons name={iconName} size={22} color={iconColor} />
          </View>
          <View className="flex-1">
            <Text
              style={{ color: colors.text }}
              className="text-base font-semibold"
            >
              {message}
            </Text>
            {subtitle && (
              <Text
                style={{ color: colors.textSecondary }}
                className="text-sm"
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <Animated.View
          style={[{ backgroundColor: progressColor, height: 3 }, progressStyle]}
        />
      </View>
    </Animated.View>
  );
}
