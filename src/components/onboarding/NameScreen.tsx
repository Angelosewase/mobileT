import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../../context/ThemeContext";
import { lightImpact, mediumImpact } from "../../utils/haptics";

interface NameScreenProps {
  onContinue: (name: string) => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function NameScreen({ onContinue, onBack }: NameScreenProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) return;
    void mediumImpact();
    onContinue(name.trim());
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
        <View style={{ backgroundColor: colors.border }} className="h-1 flex-1 rounded-full" />
        <View style={{ backgroundColor: colors.border }} className="h-1 flex-1 rounded-full" />
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-10 flex-1">
        <View className="mb-6 items-center">
          <View style={{ backgroundColor: colors.lavender }} className="mb-4 h-16 w-16 items-center justify-center rounded-full">
            <Ionicons name="person" size={32} color={colors.purple} />
          </View>
          <Text style={{ color: colors.text }} className="text-xl font-bold">
            What's your name?
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: isFocused ? colors.purple : colors.border,
          }}
          className="rounded-2xl border-2 px-4 py-3"
        >
          <TextInput
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your name"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            style={{ color: colors.text }}
            className="text-lg font-medium"
          />
        </View>

        {name.length > 0 && name.length < 2 && (
          <Text style={{ color: colors.warning }} className="mt-2 px-1 text-sm">
            At least 2 characters
          </Text>
        )}
      </Animated.View>

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(300).duration(400)} className="mb-8">
        <AnimatedPressable
          onPress={handleContinue}
          onPressIn={() => { buttonScale.value = withSpring(0.96); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          disabled={!isValid}
          style={[buttonStyle, { opacity: isValid ? 1 : 0.4 }]}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-black"
        >
          <Text className="text-base font-semibold text-white">Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
    </View>
  );
}
