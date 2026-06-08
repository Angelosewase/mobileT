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
import type { LearningGoal } from "../../context/UserContext";
import { lightImpact, mediumImpact, selectionFeedback } from "../../utils/haptics";

interface GoalScreenProps {
  name: string;
  onContinue: (goal: LearningGoal, dailyWords: number) => void;
  onBack: () => void;
}

const goals: { id: LearningGoal; title: string; words: number; icon: string }[] = [
  { id: "casual", title: "Casual", words: 3, icon: "leaf" },
  { id: "regular", title: "Regular", words: 5, icon: "walk" },
  { id: "serious", title: "Dedicated", words: 10, icon: "fitness" },
  { id: "intensive", title: "Intensive", words: 15, icon: "flame" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoalScreen({ name, onContinue, onBack }: GoalScreenProps) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<LearningGoal | null>(null);
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSelect = (goal: LearningGoal) => {
    void selectionFeedback();
    setSelected(goal);
  };

  const handleContinue = () => {
    if (!selected) return;
    void mediumImpact();
    const goal = goals.find((g) => g.id === selected);
    onContinue(selected, goal?.words ?? 5);
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
        <View style={{ backgroundColor: colors.border }} className="h-1 flex-1 rounded-full" />
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-10">
        <Text style={{ color: colors.text }} className="text-xl font-bold">
          Hi {name}! 👋
        </Text>
        <Text style={{ color: colors.textSecondary }} className="mt-1 text-base">
          How often will you explore words?
        </Text>
      </Animated.View>

      {/* Options */}
      <Animated.View entering={FadeInUp.delay(300).duration(400)} className="mt-6 gap-3">
        {goals.map((goal, index) => {
          const isSelected = selected === goal.id;
          return (
            <Pressable
              key={goal.id}
              onPress={() => handleSelect(goal.id)}
              style={{
                backgroundColor: isSelected ? colors.lavender : colors.surface,
                borderColor: isSelected ? colors.purple : colors.border,
              }}
              className="flex-row items-center gap-4 rounded-2xl border-2 p-4"
            >
              <View
                style={{ backgroundColor: isSelected ? colors.purple : colors.backgroundSubtle }}
                className="h-11 w-11 items-center justify-center rounded-xl"
              >
                <Ionicons
                  name={goal.icon as any}
                  size={22}
                  color={isSelected ? "#FFFFFF" : colors.textSecondary}
                />
              </View>
              <Text style={{ color: colors.text }} className="flex-1 text-base font-semibold">
                {goal.title}
              </Text>
              <View
                style={{ backgroundColor: isSelected ? colors.purple : colors.backgroundSubtle }}
                className="rounded-full px-3 py-1"
              >
                <Text
                  style={{ color: isSelected ? "#FFFFFF" : colors.textSecondary }}
                  className="text-sm font-medium"
                >
                  {goal.words}/day
                </Text>
              </View>
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
          disabled={!selected}
          style={[buttonStyle, { opacity: selected ? 1 : 0.4 }]}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
        >
          <Text className="text-base font-semibold text-white">Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
