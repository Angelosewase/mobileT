import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../../context/ThemeContext";
import type { Interest } from "../../context/UserContext";
import { lightImpact, mediumImpact, selectionFeedback } from "../../utils/haptics";

interface InterestsScreenProps {
  onContinue: (interests: Interest[]) => void;
  onBack: () => void;
}

const interestOptions: { id: Interest; title: string; icon: string; color: string }[] = [
  { id: "vocabulary", title: "Vocabulary", icon: "library", color: "#9B7FD4" },
  { id: "pronunciation", title: "Pronunciation", icon: "mic", color: "#34C759" },
  { id: "etymology", title: "Word Origins", icon: "git-branch", color: "#FF9500" },
  { id: "idioms", title: "Idioms", icon: "chatbubbles", color: "#FF3B30" },
  { id: "academic", title: "Academic", icon: "school", color: "#007AFF" },
  { id: "creative", title: "Creative", icon: "create", color: "#AF52DE" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function InterestsScreen({ onContinue, onBack }: InterestsScreenProps) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<Interest[]>([]);
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleToggle = (interest: Interest) => {
    void selectionFeedback();
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleContinue = () => {
    void mediumImpact();
    onContinue(selected);
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 px-6">
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center pt-4">
        <Pressable
          onPress={() => { void lightImpact(); onBack(); }}
          style={{ backgroundColor: colors.backgroundSubtle }}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
      </Animated.View>

      {/* Progress */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mt-6 flex-row gap-2">
        <View className="h-1 flex-1 rounded-full bg-verbivy-purple" />
        <View className="h-1 flex-1 rounded-full bg-verbivy-purple" />
        <View className="h-1 flex-1 rounded-full bg-verbivy-purple" />
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-10">
        <Text style={{ color: colors.text }} className="text-xl font-bold">
          What interests you? 🎯
        </Text>
        <Text style={{ color: colors.textSecondary }} className="mt-1 text-base">
          Select one or more topics
        </Text>
      </Animated.View>

      {/* Options Grid */}
      <Animated.View entering={FadeInUp.delay(300).duration(400)} className="mt-6 flex-row flex-wrap gap-3">
        {interestOptions.map((interest) => {
          const isSelected = selected.includes(interest.id);
          return (
            <Pressable
              key={interest.id}
              onPress={() => handleToggle(interest.id)}
              style={{
                width: "47%",
                backgroundColor: isSelected ? `${interest.color}20` : colors.surface,
                borderColor: isSelected ? interest.color : colors.border,
              }}
              className="items-center gap-2 rounded-2xl border-2 p-4"
            >
              <View
                style={{ backgroundColor: isSelected ? interest.color : colors.backgroundSubtle }}
                className="h-12 w-12 items-center justify-center rounded-xl"
              >
                <Ionicons
                  name={interest.icon as any}
                  size={24}
                  color={isSelected ? "#FFFFFF" : colors.textSecondary}
                />
              </View>
              <Text style={{ color: colors.text }} className="text-sm font-medium">
                {interest.title}
              </Text>
              {isSelected && (
                <View
                  style={{ backgroundColor: interest.color }}
                  className="absolute right-2 top-2 h-5 w-5 items-center justify-center rounded-full"
                >
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Spacer */}
      <View className="flex-1" />

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(500).duration(400)} className="mb-8">
        <AnimatedPressable
          onPress={handleContinue}
          onPressIn={() => { buttonScale.value = withSpring(0.96); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          disabled={selected.length === 0}
          style={[buttonStyle, { opacity: selected.length > 0 ? 1 : 0.4 }]}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
        >
          <Text className="text-base font-semibold text-white">
            {selected.length === 0 ? "Select at least one" : "Continue"}
          </Text>
          {selected.length > 0 && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
