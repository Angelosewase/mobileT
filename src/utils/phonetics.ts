import type { DictionaryEntry, Phonetic } from "../types/dictionary";

export function getPhoneticText(phonetics: Phonetic[]): string | null {
  const texts = phonetics
    .map((item) => item.text?.trim())
    .filter((text): text is string => Boolean(text));

  if (texts.length === 0) {
    return null;
  }

  return [...new Set(texts)].join(" · ");
}

export function getAudioUrls(phonetics: Phonetic[]): string[] {
  return [
    ...new Set(
      phonetics
        .map((item) => item.audio?.trim())
        .filter((url): url is string => Boolean(url)),
    ),
  ];
}

export function getPrimaryEntry(entries: DictionaryEntry[]): DictionaryEntry {
  return entries[0];
}
