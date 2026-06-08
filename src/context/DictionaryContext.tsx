import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchWordDefinition } from "../services/dictionaryApi";
import type { DictionaryEntry, DictionaryError } from "../types/dictionary";
import { errorNotification, successNotification } from "../utils/haptics";
import { getValidationError } from "../utils/validation";

interface GamificationStats {
  totalSearches: number;
  successfulSearches: number;
  currentStreak: number;
  bestStreak: number;
  lastSearchDate: string | null;
}

interface DictionaryContextValue {
  query: string;
  entries: DictionaryEntry[] | null;
  loading: boolean;
  error: DictionaryError | null;
  history: string[];
  stats: GamificationStats;
  justFoundWord: boolean;
  searchWord: (word: string) => Promise<void>;
  retry: () => void;
  clearJustFound: () => void;
  clearSearch: () => void;
  removeFromHistory: (word: string) => void;
  clearHistory: () => void;
  resetStats: () => void;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

const initialStats: GamificationStats = {
  totalSearches: 0,
  successfulSearches: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastSearchDate: null,
};

function addToHistory(history: string[], word: string): string[] {
  const normalized = word.trim().toLowerCase();
  const filtered = history.filter(
    (item) => item.toLowerCase() !== normalized,
  );
  return [normalized, ...filtered].slice(0, 20);
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function updateStatsOnSuccess(stats: GamificationStats): GamificationStats {
  const today = getTodayDateString();
  const isNewDay = stats.lastSearchDate !== today;
  const newStreak = isNewDay ? stats.currentStreak + 1 : stats.currentStreak;

  return {
    totalSearches: stats.totalSearches + 1,
    successfulSearches: stats.successfulSearches + 1,
    currentStreak: Math.max(1, newStreak),
    bestStreak: Math.max(stats.bestStreak, newStreak, 1),
    lastSearchDate: today,
  };
}

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DictionaryError | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [stats, setStats] = useState<GamificationStats>(initialStats);
  const [justFoundWord, setJustFoundWord] = useState(false);

  const clearJustFound = useCallback(() => {
    setJustFoundWord(false);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setEntries(null);
    setError(null);
    setJustFoundWord(false);
  }, []);

  const removeFromHistory = useCallback((word: string) => {
    setHistory((prev) =>
      prev.filter((item) => item.toLowerCase() !== word.toLowerCase()),
    );
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, []);

  const searchWord = useCallback(async (word: string) => {
    const trimmed = word.trim();

    if (!trimmed) {
      setError({
        code: "UNKNOWN",
        message: "Please enter a word before searching.",
      });
      void errorNotification();
      return;
    }

    const validationError = getValidationError(trimmed);
    if (validationError) {
      setError({
        code: "UNKNOWN",
        message: validationError,
      });
      void errorNotification();
      return;
    }

    setQuery(trimmed);
    setLoading(true);
    setError(null);
    setJustFoundWord(false);

    try {
      const data = await fetchWordDefinition(trimmed);
      setEntries(data);
      setHistory((prev) => addToHistory(prev, trimmed));
      setStats((prev) => updateStatsOnSuccess(prev));
      setJustFoundWord(true);
      void successNotification();
    } catch (err) {
      setEntries(null);
      setError(err as DictionaryError);
      void errorNotification();
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (query) {
      void searchWord(query);
    }
  }, [query, searchWord]);

  const value = useMemo(
    () => ({
      query,
      entries,
      loading,
      error,
      history,
      stats,
      justFoundWord,
      searchWord,
      retry,
      clearJustFound,
      clearSearch,
      removeFromHistory,
      clearHistory,
      resetStats,
    }),
    [
      query,
      entries,
      loading,
      error,
      history,
      stats,
      justFoundWord,
      searchWord,
      retry,
      clearJustFound,
      clearSearch,
      removeFromHistory,
      clearHistory,
      resetStats,
    ],
  );

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error("useDictionary must be used within DictionaryProvider");
  }

  return context;
}
