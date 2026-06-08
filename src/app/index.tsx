import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorState } from "../components/ErrorState";
import { SearchBar } from "../components/SearchBar";
import { WordDetails } from "../components/WordDetails";
import { useDictionary } from "../context/DictionaryContext";

export default function Index() {
  const { query, entries, loading, error, searchWord, retry } = useDictionary();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8 pt-2"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Text className="text-2xl font-bold text-black">Look up a word</Text>
          <Text className="text-base text-verbivy-text-secondary">
            Search the English dictionary and hear pronunciations when available.
          </Text>
        </View>

        <SearchBar
          key={query}
          initialValue={query}
          loading={loading}
          onSearch={searchWord}
        />

        {loading ? (
          <View className="items-center gap-3 py-10">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="text-base text-verbivy-text-secondary">
              Fetching definition...
            </Text>
          </View>
        ) : null}

        {!loading && error ? <ErrorState error={error} onRetry={retry} /> : null}

        {!loading && !error && entries ? (
          <WordDetails entries={entries} />
        ) : null}

        {!loading && !error && !entries ? (
          <View className="rounded-2xl bg-verbivy-lavender/50 px-5 py-6">
            <Text className="text-base font-semibold text-black">
              Start exploring
            </Text>
            <Text className="mt-2 text-base leading-6 text-verbivy-text-secondary">
              Enter a word above to see its meaning, part of speech, examples,
              and pronunciation.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
