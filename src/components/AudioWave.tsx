import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";

interface AudioWaveProps {
  isPlaying: boolean;
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  minHeight?: number;
  maxHeight?: number;
  color?: string;
}

function WaveBar({
  index,
  isPlaying,
  barWidth,
  minHeight,
  maxHeight,
  color,
}: {
  index: number;
  isPlaying: boolean;
  barWidth: number;
  minHeight: number;
  maxHeight: number;
  color: string;
}) {
  const height = useSharedValue(minHeight);

  useEffect(() => {
    if (isPlaying) {
      const randomDelay = index * 80;
      const randomDuration = 300 + Math.random() * 200;
      const randomMax = minHeight + Math.random() * (maxHeight - minHeight);

      height.value = withDelay(
        randomDelay,
        withRepeat(
          withSequence(
            withTiming(randomMax, { duration: randomDuration, easing: Easing.inOut(Easing.ease) }),
            withTiming(minHeight + Math.random() * 8, { duration: randomDuration, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        ),
      );
    } else {
      cancelAnimation(height);
      height.value = withTiming(minHeight, { duration: 200 });
    }
  }, [isPlaying, index, minHeight, maxHeight, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: barWidth,
          backgroundColor: color,
          borderRadius: barWidth / 2,
        },
      ]}
    />
  );
}

export function AudioWave({
  isPlaying,
  barCount = 5,
  barWidth = 4,
  barGap = 3,
  minHeight = 8,
  maxHeight = 24,
  color,
}: AudioWaveProps) {
  const { colors } = useTheme();
  const barColor = color ?? colors.purple;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: barGap,
        height: maxHeight,
      }}
    >
      {Array.from({ length: barCount }).map((_, index) => (
        <WaveBar
          key={index}
          index={index}
          isPlaying={isPlaying}
          barWidth={barWidth}
          minHeight={minHeight}
          maxHeight={maxHeight}
          color={barColor}
        />
      ))}
    </View>
  );
}
