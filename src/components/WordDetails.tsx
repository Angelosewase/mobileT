import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";
import type { DictionaryEntry } from "../types/dictionary";
import { lightImpact } from "../utils/haptics";
import { getAudioUrls, getPhoneticText } from "../utils/phonetics";
import { AudioButton } from "./AudioButton";

interface WordDetailsProps {
  entries: DictionaryEntry[];
}

export function WordDetails({ entries }: WordDetailsProps) {
  const { colors } = useTheme();
  const entry = entries[0];
  const phoneticText = getPhoneticText(entry.phonetics);
  const audioUrls = getAudioUrls(entry.phonetics);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(0);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const totalDefinitions = entry.meanings.reduce(
    (acc, m) => acc + m.definitions.length,
    0,
  );

  return (
    <Animated.View entering={FadeInDown.duration(400)} className="gap-6">
      {/* Word Header Card */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
        className="overflow-hidden rounded-3xl border"
      >
        {/* Top accent bar */}
        <View style={{ backgroundColor: colors.purple }} className="h-1.5" />

        <View className="gap-4 p-5">
          {/* Word and phonetics */}
          <View className="gap-2">
            <Text
              style={{ color: colors.text }}
              className="text-4xl font-bold tracking-tight"
            >
              {entry.word}
            </Text>

            {phoneticText && (
              <Text style={{ color: colors.textSecondary }} className="text-lg">
                {phoneticText}
              </Text>
            )}
          </View>

          {/* Audio Section */}
          {audioUrls.length > 0 && (
            <View className="gap-3">
              {/* Toggle between compact and full player */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  {audioUrls.map((url, index) => (
                    <AudioButton
                      key={`${url}-${index}`}
                      audioUrl={url}
                      compact
                      label={
                        audioUrls.length > 1
                          ? `Pronunciation ${index + 1}`
                          : "Listen to pronunciation"
                      }
                    />
                  ))}
                </View>

                {audioUrls.length > 0 && (
                  <Pressable
                    onPress={() => {
                      void lightImpact();
                      setShowFullPlayer(!showFullPlayer);
                    }}
                    style={{ backgroundColor: colors.backgroundSubtle }}
                    className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
                  >
                    <Ionicons
                      name={showFullPlayer ? "chevron-up" : "options"}
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                      {showFullPlayer ? "Less" : "Controls"}
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Full Audio Player */}
              {showFullPlayer && audioUrls.length > 0 && (
                <View className="gap-2">
                  {/* Audio selector if multiple */}
                  {audioUrls.length > 1 && (
                    <View className="flex-row gap-2">
                      {audioUrls.map((_, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            void lightImpact();
                            setSelectedAudioIndex(index);
                          }}
                          style={{
                            backgroundColor:
                              selectedAudioIndex === index
                                ? colors.purple
                                : colors.backgroundSubtle,
                          }}
                          className="rounded-full px-3 py-1.5"
                        >
                          <Text
                            style={{
                              color:
                                selectedAudioIndex === index
                                  ? "#FFFFFF"
                                  : colors.textSecondary,
                            }}
                            className="text-sm font-medium"
                          >
                            Audio {index + 1}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  <AudioButton
                    audioUrl={audioUrls[selectedAudioIndex]}
                    label="Pronunciation"
                  />
                </View>
              )}
            </View>
          )}

          {/* Quick stats */}
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="book-outline" size={16} color={colors.purple} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                {entry.meanings.length} part
                {entry.meanings.length !== 1 ? "s" : ""} of speech
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="list-outline" size={16} color={colors.purple} />
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                {totalDefinitions} definition
                {totalDefinitions !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meanings */}
      {entry.meanings.map((meaning, meaningIndex) => (
        <Animated.View
          key={`${meaning.partOfSpeech}-${meaningIndex}`}
          entering={FadeInDown.delay(100 * (meaningIndex + 1)).duration(400)}
          className="gap-4"
        >
          {/* Part of speech header */}
          <View className="flex-row items-center gap-3">
            <View
              style={{ backgroundColor: colors.lavender }}
              className="rounded-xl px-4 py-2"
            >
              <Text
                style={{ color: colors.text }}
                className="text-base font-semibold capitalize"
              >
                {meaning.partOfSpeech}
              </Text>
            </View>
            <View
              style={{ backgroundColor: colors.border }}
              className="h-px flex-1"
            />
          </View>

          {/* Definitions list */}
          <View className="gap-4 pl-2">
            {meaning.definitions.map((definition, definitionIndex) => (
              <View
                key={`${meaning.partOfSpeech}-${definitionIndex}`}
                className="gap-3"
              >
                {/* Definition number and text */}
                <View className="flex-row gap-3">
                  <View
                    style={{ backgroundColor: `${colors.lavender}90` }}
                    className="mt-0.5 h-6 w-6 items-center justify-center rounded-full"
                  >
                    <Text
                      style={{ color: colors.purple }}
                      className="text-xs font-semibold"
                    >
                      {definitionIndex + 1}
                    </Text>
                  </View>
                  <Text
                    style={{ color: colors.text }}
                    className="flex-1 text-base leading-7"
                  >
                    {definition.definition}
                  </Text>
                </View>

                {/* Example sentence */}
                {definition.example && (
                  <View className="ml-9 flex-row">
                    <View
                      style={{ backgroundColor: colors.lavenderStrong }}
                      className="w-1 rounded-full"
                    />
                    <View
                      style={{ backgroundColor: `${colors.lavender}60` }}
                      className="flex-1 rounded-r-2xl px-4 py-3"
                    >
                      <Text
                        style={{ color: colors.textSecondary }}
                        className="text-sm italic leading-6"
                      >
                        "{definition.example}"
                      </Text>
                    </View>
                  </View>
                )}

                {/* Synonyms */}
                {definition.synonyms && definition.synonyms.length > 0 && (
                  <View className="ml-9 flex-row flex-wrap items-center gap-2">
                    <Text
                      style={{ color: colors.textTertiary }}
                      className="text-xs font-medium uppercase tracking-wide"
                    >
                      Similar:
                    </Text>
                    {definition.synonyms.slice(0, 4).map((synonym) => (
                      <View
                        key={synonym}
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                        }}
                        className="rounded-full border px-2.5 py-1"
                      >
                        <Text
                          style={{ color: colors.textSecondary }}
                          className="text-xs"
                        >
                          {synonym}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Part of speech level synonyms/antonyms */}
          {meaning.synonyms && meaning.synonyms.length > 0 && (
            <View
              style={{ backgroundColor: colors.mint }}
              className="gap-2 rounded-2xl p-4"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="swap-horizontal" size={16} color={colors.success} />
                <Text style={{ color: colors.text }} className="text-sm font-semibold">
                  Synonyms
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {meaning.synonyms.slice(0, 8).map((synonym) => (
                  <View
                    key={synonym}
                    style={{ backgroundColor: colors.background }}
                    className="rounded-full px-3 py-1.5"
                  >
                    <Text style={{ color: colors.textSecondary }} className="text-sm">
                      {synonym}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {meaning.antonyms && meaning.antonyms.length > 0 && (
            <View
              style={{ backgroundColor: colors.peach }}
              className="gap-2 rounded-2xl p-4"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="return-up-back" size={16} color={colors.warning} />
                <Text style={{ color: colors.text }} className="text-sm font-semibold">
                  Antonyms
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {meaning.antonyms.slice(0, 8).map((antonym) => (
                  <View
                    key={antonym}
                    style={{ backgroundColor: colors.background }}
                    className="rounded-full px-3 py-1.5"
                  >
                    <Text style={{ color: colors.textSecondary }} className="text-sm">
                      {antonym}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Divider between parts of speech */}
          {meaningIndex < entry.meanings.length - 1 && (
            <View
              style={{ backgroundColor: colors.border }}
              className="mx-4 h-px"
            />
          )}
        </Animated.View>
      ))}

      {/* Source attribution */}
      {entry.sourceUrls && entry.sourceUrls.length > 0 && (
        <View className="items-center gap-1 py-4">
          <Text style={{ color: colors.textTertiary }} className="text-xs">
            Data sourced from
          </Text>
          <Text style={{ color: colors.purple }} className="text-xs">
            Free Dictionary API
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
