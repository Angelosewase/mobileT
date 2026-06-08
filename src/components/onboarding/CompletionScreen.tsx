import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../context/ThemeContext";
import { mediumImpact, successNotification } from "../../utils/haptics";
import { SuccessIllustration } from "../Illustrations";

interface CompletionScreenProps {
  name: string;
  onComplete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ConfettiPiece({ delay, startX, color }: { delay: number; startX: number; color: string }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 80;
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));
    translateY.value = withDelay(delay, withTiming(400, { duration: 2500, easing: Easing.out(Easing.quad) }));
    translateX.value = withDelay(delay, withTiming(startX + randomX, { duration: 2500 }));
    rotate.value = withDelay(delay, withRepeat(withTiming(360, { duration: 800 }), -1));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[style, {
        position: "absolute",
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: 2,
      }]}
    />
  );
}

export function CompletionScreen({ name, onComplete }: CompletionScreenProps) {
  const { colors } = useTheme();
  const buttonScale = useSharedValue(1);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    void successNotification();
    checkScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 100 }));
  }, []);

  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));

  const handleComplete = () => {
    void mediumImpact();
    onComplete();
  };

  const confettiColors = [colors.purple, colors.success, colors.warning, "#FF6B6B", "#4ECDC4"];

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 px-6">
      {/* Confetti */}
      <View className="absolute inset-x-0 top-0 h-48 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            delay={i * 80}
            startX={Math.random() * 350}
            color={confettiColors[i % confettiColors.length]}
          />
        ))}
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Animated.View style={checkStyle} className="mb-6">
          <SuccessIllustration size={120} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(400)} className="items-center">
          <Text style={{ color: colors.text }} className="text-2xl font-bold">
            You're all set! 🎉
          </Text>
          <Text style={{ color: colors.textSecondary }} className="mt-2 text-center text-base">
            Welcome, {name}!
          </Text>
        </Animated.View>

        {/* Quick summary */}
        <Animated.View
          entering={FadeIn.delay(700).duration(400)}
          style={{ backgroundColor: colors.lavender }}
          className="mt-8 w-full rounded-2xl p-4"
        >
          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="today" size={20} color={colors.purple} />
              <Text style={{ color: colors.text }} className="text-sm">Daily word recommendations</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Ionicons name="analytics" size={20} color={colors.success} />
              <Text style={{ color: colors.text }} className="text-sm">Progress & streaks</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Ionicons name="sparkles" size={20} color={colors.warning} />
              <Text style={{ color: colors.text }} className="text-sm">Personalized experience</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(900).duration(400)} className="mb-8">
        <AnimatedPressable
          onPress={handleComplete}
          onPressIn={() => { buttonScale.value = withSpring(0.96); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          style={buttonStyle}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
        >
          <Text className="text-base font-semibold text-white">Start Exploring</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
