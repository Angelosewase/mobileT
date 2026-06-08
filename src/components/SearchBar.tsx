import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface SearchBarProps {
  initialValue?: string;
  loading?: boolean;
  onSearch: (word: string) => void;
}

export function SearchBar({ initialValue = "", loading = false, onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSearch = () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setValidationError("Please enter a word to search.");
      return;
    }

    setValidationError(null);
    onSearch(trimmed);
  };

  return (
    <View className="gap-3">
      <View className="rounded-2xl border border-verbivy-border bg-white px-4 py-3">
        <TextInput
          value={value}
          onChangeText={(text) => {
            setValue(text);
            if (validationError) {
              setValidationError(null);
            }
          }}
          onSubmitEditing={handleSearch}
          placeholder="Search for a word..."
          placeholderTextColor="#AEAEB2"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          editable={!loading}
          className="text-base text-black"
          accessibilityLabel="Word search input"
        />
      </View>

      {validationError ? (
        <Text className="text-sm text-verbivy-error">{validationError}</Text>
      ) : null}

      <Pressable
        onPress={handleSearch}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Search dictionary"
        className={`h-14 items-center justify-center rounded-full bg-black ${loading ? "opacity-40" : "active:opacity-90"}`}
      >
        <Text className="text-base font-semibold text-white">
          {loading ? "Searching..." : "Search"}
        </Text>
      </Pressable>
    </View>
  );
}
