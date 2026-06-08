import { Text, View } from "react-native";

import type { DictionaryEntry } from "../types/dictionary";
import { getAudioUrls, getPhoneticText } from "../utils/phonetics";
import { AudioButton } from "./AudioButton";

interface WordDetailsProps {
  entries: DictionaryEntry[];
}

export function WordDetails({ entries }: WordDetailsProps) {
  const entry = entries[0];
  const phoneticText = getPhoneticText(entry.phonetics);
  const audioUrls = getAudioUrls(entry.phonetics);

  return (
    <View className="gap-6">
      <View className="gap-3">
        <Text className="text-3xl font-bold tracking-tight text-black">
          {entry.word}
        </Text>

        {phoneticText || audioUrls.length > 0 ? (
          <View className="flex-row flex-wrap items-center gap-3">
            {phoneticText ? (
              <Text className="text-lg text-verbivy-text-secondary">
                {phoneticText}
              </Text>
            ) : null}

            {audioUrls.map((url, index) => (
              <AudioButton
                key={`${url}-${index}`}
                audioUrl={url}
                compact
                label={`Pronunciation ${index + 1}`}
              />
            ))}
          </View>
        ) : null}
      </View>

      {entry.meanings.map((meaning, meaningIndex) => (
        <View key={`${meaning.partOfSpeech}-${meaningIndex}`} className="gap-3">
          <View className="self-start rounded-xl bg-verbivy-lavender px-3 py-1.5">
            <Text className="text-sm font-semibold capitalize text-black">
              {meaning.partOfSpeech}
            </Text>
          </View>

          <View className="gap-4">
            {meaning.definitions.map((definition, definitionIndex) => (
              <View
                key={`${meaning.partOfSpeech}-${definitionIndex}`}
                className="gap-2 border-b border-verbivy-border pb-4 last:border-b-0 last:pb-0"
              >
                <Text className="text-base leading-6 text-black">
                  <Text className="font-semibold text-verbivy-text-secondary">
                    {definitionIndex + 1}.{" "}
                  </Text>
                  {definition.definition}
                </Text>

                {definition.example ? (
                  <View className="rounded-2xl bg-verbivy-lavender px-4 py-3">
                    <Text className="text-base italic leading-6 text-black">
                      “{definition.example}”
                    </Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
