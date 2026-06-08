import commonWords from "../data/common-words.json";

export const QUICK_SEARCH_WORDS = [
  "eloquent",
  "ephemeral",
  "resilient",
  "luminous",
] as const;

export type SuggestionSource = "history" | "dictionary";

export interface WordSuggestion {
  word: string;
  source: SuggestionSource;
}

const WORD_BANK = commonWords as string[];

export function getSuggestionQuery(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  if (/\s/.test(trimmed)) {
    return trimmed.split(/\s+/)[0]?.toLowerCase() ?? "";
  }

  return trimmed.toLowerCase();
}

export function splitSuggestionMatch(
  query: string,
  word: string,
): { prefix: string; remainder: string } {
  const normalizedQuery = query.toLowerCase();
  const normalizedWord = word.toLowerCase();

  if (!normalizedQuery || !normalizedWord.startsWith(normalizedQuery)) {
    return { prefix: "", remainder: word };
  }

  return {
    prefix: word.slice(0, normalizedQuery.length),
    remainder: word.slice(normalizedQuery.length),
  };
}

export function getWordSuggestions(
  input: string,
  history: string[] = [],
  limit = 8,
): WordSuggestion[] {
  const query = getSuggestionQuery(input);

  if (query.length < 1) {
    return [];
  }

  const results: WordSuggestion[] = [];
  const seen = new Set<string>();

  const addSuggestion = (word: string, source: SuggestionSource) => {
    const normalized = word.toLowerCase();
    if (seen.has(normalized) || normalized === query) {
      return;
    }
    if (!normalized.startsWith(query)) {
      return;
    }
    seen.add(normalized);
    results.push({ word: normalized, source });
  };

  for (const word of history) {
    addSuggestion(word, "history");
    if (results.length >= limit) {
      return results;
    }
  }

  for (const word of WORD_BANK) {
    addSuggestion(word, "dictionary");
    if (results.length >= limit) {
      break;
    }
  }

  return results;
}
