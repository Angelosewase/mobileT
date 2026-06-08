import { Ionicons } from "@expo/vector-icons";
interface HistoryDrawerProps {
  navigation: {
    closeDrawer: () => void;
  };
}
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDictionary } from "../context/DictionaryContext";

export function HistoryDrawer(props: HistoryDrawerProps) {
  const insets = useSafeAreaInsets();
  const { history, searchWord, loading } = useDictionary();

  const handleSelect = (word: string) => {
    props.navigation.closeDrawer();
    void searchWord(word);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
        flexGrow: 1,
      }}
    >
      <View className="px-4 pb-4">
        <Text className="text-2xl font-bold text-black">LexiTech</Text>
        <Text className="mt-1 text-sm text-verbivy-text-secondary">
          Dictionary by LexiTech Solutions Ltd
        </Text>
      </View>

      <View className="mx-4 mb-4 h-px bg-verbivy-border" />

      <View className="px-4">
        <Text className="mb-3 text-base font-semibold text-black">
          Search History
        </Text>

        {history.length === 0 ? (
          <View className="rounded-2xl bg-verbivy-lavender/50 px-4 py-5">
            <Text className="text-base text-verbivy-text-secondary">
              Your recent searches will appear here after you look up a word.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {history.map((word) => (
              <Pressable
                key={word}
                onPress={() => handleSelect(word)}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={`Search for ${word}`}
                className={`flex-row items-center gap-3 rounded-2xl border border-verbivy-border bg-white px-4 py-3 ${loading ? "opacity-50" : "active:bg-verbivy-lavender/30"}`}
              >
                <Ionicons name="time-outline" size={20} color="#6B6B70" />
                <Text className="flex-1 text-base capitalize text-black">
                  {word}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#AEAEB2" />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
