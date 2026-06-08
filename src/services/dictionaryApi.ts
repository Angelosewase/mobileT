import axios from "axios";

import type {
  DictionaryApiErrorResponse,
  DictionaryEntry,
  DictionaryError,
} from "../types/dictionary";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

function isDictionaryEntryArray(data: unknown): data is DictionaryEntry[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    "word" in data[0] &&
    "meanings" in data[0]
  );
}

function toDictionaryError(error: unknown): DictionaryError {
  if (axios.isAxiosError<DictionaryApiErrorResponse>(error)) {
    if (!error.response) {
      return {
        code: "NETWORK",
        message: "Unable to reach the dictionary. Check your connection and try again.",
      };
    }

    if (error.response.status === 404) {
      const body = error.response.data;
      return {
        code: "NOT_FOUND",
        message:
          body?.message ??
          "We couldn't find definitions for that word. Try another spelling.",
        resolution: body?.resolution,
      };
    }

    return {
      code: "UNKNOWN",
      message: "Something went wrong while fetching the definition. Please try again.",
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred. Please try again.",
  };
}

export async function fetchWordDefinition(
  word: string,
): Promise<DictionaryEntry[]> {
  const trimmed = word.trim().toLowerCase();

  try {
    const response = await axios.get<DictionaryEntry[]>(
      `${BASE_URL}/${encodeURIComponent(trimmed)}`,
      { timeout: 15000 },
    );

    if (!isDictionaryEntryArray(response.data)) {
      throw {
        code: "MALFORMED" as const,
        message: "The dictionary returned an unexpected response. Please try again.",
      } satisfies DictionaryError;
    }

    return response.data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as DictionaryError).code === "MALFORMED"
    ) {
      throw error;
    }

    throw toDictionaryError(error);
  }
}
