import { Pressable, Text, View } from "react-native";

import type { DictionaryError } from "../types/dictionary";

interface ErrorStateProps {
  error: DictionaryError;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const title =
    error.code === "NOT_FOUND"
      ? "Word not found"
      : error.code === "NETWORK"
        ? "Connection problem"
        : "Something went wrong";

  return (
    <View className="rounded-2xl border border-verbivy-border bg-verbivy-lavender/40 p-5">
      <Text className="text-lg font-semibold text-black">{title}</Text>
      <Text className="mt-2 text-base leading-6 text-verbivy-text-secondary">
        {error.message}
      </Text>
      {error.resolution ? (
        <Text className="mt-2 text-sm leading-5 text-verbivy-text-tertiary">
          {error.resolution}
        </Text>
      ) : null}

      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry search"
          className="mt-4 h-12 items-center justify-center rounded-full border border-verbivy-purple bg-white active:opacity-90"
        >
          <Text className="text-base font-semibold text-black">Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
