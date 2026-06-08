import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";
import type { Interest, LearningGoal } from "../../context/UserContext";
import { useUser } from "../../context/UserContext";
import { CompletionScreen } from "./CompletionScreen";
import { GoalScreen } from "./GoalScreen";
import { InterestsScreen } from "./InterestsScreen";
import { NameScreen } from "./NameScreen";
import { WelcomeScreen } from "./WelcomeScreen";

type OnboardingStep = "welcome" | "name" | "goal" | "interests" | "completion";

interface OnboardingData {
  name: string;
  learningGoal: LearningGoal;
  dailyWordGoal: number;
  interests: Interest[];
}

export function Onboarding() {
  const { colors } = useTheme();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData>({
    name: "",
    learningGoal: "regular",
    dailyWordGoal: 5,
    interests: [],
  });

  const handleWelcomeContinue = () => {
    setStep("name");
  };

  const handleNameContinue = (name: string) => {
    setData((prev) => ({ ...prev, name }));
    setStep("goal");
  };

  const handleGoalContinue = (goal: LearningGoal, dailyWords: number) => {
    setData((prev) => ({ ...prev, learningGoal: goal, dailyWordGoal: dailyWords }));
    setStep("interests");
  };

  const handleInterestsContinue = (interests: Interest[]) => {
    setData((prev) => ({ ...prev, interests }));
    setStep("completion");
  };

  const handleComplete = async () => {
    await completeOnboarding({
      name: data.name,
      learningGoal: data.learningGoal,
      interests: data.interests,
      dailyWordGoal: data.dailyWordGoal,
    });
  };

  const handleBack = () => {
    switch (step) {
      case "name":
        setStep("welcome");
        break;
      case "goal":
        setStep("name");
        break;
      case "interests":
        setStep("goal");
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
      edges={["top", "bottom"]}
    >
      {step === "welcome" && <WelcomeScreen onContinue={handleWelcomeContinue} />}
      {step === "name" && (
        <NameScreen onContinue={handleNameContinue} onBack={handleBack} />
      )}
      {step === "goal" && (
        <GoalScreen
          name={data.name}
          onContinue={handleGoalContinue}
          onBack={handleBack}
        />
      )}
      {step === "interests" && (
        <InterestsScreen onContinue={handleInterestsContinue} onBack={handleBack} />
      )}
      {step === "completion" && (
        <CompletionScreen name={data.name} onComplete={handleComplete} />
      )}
    </SafeAreaView>
  );
}
