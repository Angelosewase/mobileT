import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
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
import { lightImpact, mediumImpact } from "../../utils/haptics";

interface WelcomeScreenProps {
  onContinue: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const { colors, mode, setMode, isDark } = useTheme();
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const floatY = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
    logoRotate.value = withDelay(
      200,
      withSequence(
        withTiming(10, { duration: 150 }),
        withTiming(-10, { duration: 150 }),
        withTiming(0, { duration: 150 }),
      ),
    );
    floatY.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
      { translateY: floatY.value },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePress = () => {
    void mediumImpact();
    onContinue();
  };

  const cycleTheme = () => {
    void lightImpact();
    if (mode === "light") setMode("dark");
    else if (mode === "dark") setMode("system");
    else setMode("light");
  };

  const themeIcon = mode === "light" ? "sunny" : mode === "dark" ? "moon" : "contrast";
  const themeLabel = mode === "light" ? "Light" : mode === "dark" ? "Dark" : "Auto";

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 px-6">
      {/* Theme Toggle - Top Right */}
      <Animated.View
        entering={FadeIn.delay(400).duration(400)}
        className="absolute right-6 top-4 z-10"
      >
        <Pressable
          onPress={cycleTheme}
          style={{ backgroundColor: colors.backgroundSubtle }}
          className="flex-row items-center gap-2 rounded-full px-4 py-2"
        >
          <Ionicons name={themeIcon} size={18} color={colors.purple} />
          <Text style={{ color: colors.text }} className="text-sm font-medium">
            {themeLabel}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Logo Section */}
      <View className="flex-1 items-center justify-center">
        <Animated.View style={logoStyle} className="items-center gap-4">
          <View className="h-28 w-28 items-center justify-center rounded-3xl bg-black shadow-xl">
            <Ionicons name="book" size={56} color="#FFFFFF" />
          </View>

          <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center">
            <Text style={{ color: colors.text }} className="text-3xl font-bold">
              LexiTech
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-base">
              Dictionary
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(700).duration(500)}
          className="mt-8 items-center"
        >
          <Text style={{ color: colors.text }} className="text-center text-xl font-semibold">
            Discover words instantly
          </Text>
          <Text style={{ color: colors.textSecondary }} className="mt-1 text-center text-base">
            Meanings, examples & pronunciations
          </Text>
        </Animated.View>
      </View>

      {/* Features - Compact */}
      <Animated.View entering={FadeInDown.delay(900).duration(500)} className="mb-6 gap-3">
        <View className="flex-row gap-3">
          <View style={{ backgroundColor: colors.lavender }} className="flex-1 flex-row items-center gap-2 rounded-xl p-3">
            <Ionicons name="search" size={20} color={colors.purple} />
            <Text style={{ color: colors.text }} className="text-sm font-medium">Search</Text>
          </View>
          <View style={{ backgroundColor: colors.mint }} className="flex-1 flex-row items-center gap-2 rounded-xl p-3">
            <Ionicons name="volume-high" size={20} color={colors.success} />
            <Text style={{ color: colors.text }} className="text-sm font-medium">Listen</Text>
          </View>
          <View style={{ backgroundColor: colors.peach }} className="flex-1 flex-row items-center gap-2 rounded-xl p-3">
            <Ionicons name="time" size={20} color={colors.warning} />
            <Text style={{ color: colors.text }} className="text-sm font-medium">History</Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View entering={FadeInUp.delay(1100).duration(500)} className="mb-8">
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={() => { buttonScale.value = withSpring(0.96); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          style={buttonStyle}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
        >
          <Text className="text-base font-semibold text-white">Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
