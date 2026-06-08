import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { useTheme } from "../context/ThemeContext";
import { lightImpact, errorNotification } from "../utils/haptics";

interface SwipeableHistoryItemProps {
  word: string;
  onPress: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function SwipeableHistoryItem({
  word,
  onPress,
  onDelete,
  disabled = false,
}: SwipeableHistoryItemProps) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    void errorNotification();
    swipeableRef.current?.close();
    onDelete();
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
          justifyContent: "center",
          alignItems: "center",
          width: 80,
        }}
      >
        <Pressable
          onPress={handleDelete}
          className="h-full w-full items-center justify-center rounded-r-2xl bg-verbivy-error"
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text className="mt-1 text-xs font-medium text-white">Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
    >
      <Pressable
        onPress={() => {
          void lightImpact();
          onPress();
        }}
        onLongPress={() => {
          void lightImpact();
          swipeableRef.current?.openRight();
        }}
        disabled={disabled}
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.5 : 1,
        }}
        className="flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
      >
        <View
          style={{ backgroundColor: `${colors.lavender}80` }}
          className="h-8 w-8 items-center justify-center rounded-full"
        >
          <Text
            style={{ color: colors.purple }}
            className="text-sm font-semibold uppercase"
          >
            {word.charAt(0)}
          </Text>
        </View>
        <Text
          style={{ color: colors.text }}
          className="flex-1 text-base capitalize"
        >
          {word}
        </Text>
        <Ionicons name="arrow-forward" size={18} color={colors.textTertiary} />
      </Pressable>
    </Swipeable>
  );
}
