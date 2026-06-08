export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
}

export interface DictionaryApiErrorResponse {
  title?: string;
  message?: string;
  resolution?: string;
}

export type DictionaryErrorCode = "NOT_FOUND" | "NETWORK" | "MALFORMED" | "UNKNOWN";

export interface DictionaryError {
  code: DictionaryErrorCode;
  message: string;
  resolution?: string;
}
