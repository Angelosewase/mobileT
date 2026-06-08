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

interface DictionaryContextValue {
  query: string;
  entries: DictionaryEntry[] | null;
  loading: boolean;
  error: DictionaryError | null;
  history: string[];
  searchWord: (word: string) => Promise<void>;
  retry: () => void;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

function addToHistory(history: string[], word: string): string[] {
  const normalized = word.trim().toLowerCase();
  const filtered = history.filter(
    (item) => item.toLowerCase() !== normalized,
  );
  return [normalized, ...filtered].slice(0, 20);
}

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DictionaryError | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const searchWord = useCallback(async (word: string) => {
    const trimmed = word.trim();

    if (!trimmed) {
      setError({
        code: "UNKNOWN",
        message: "Please enter a word before searching.",
      });
      return;
    }

    setQuery(trimmed);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWordDefinition(trimmed);
      setEntries(data);
      setHistory((prev) => addToHistory(prev, trimmed));
    } catch (err) {
      setEntries(null);
      setError(err as DictionaryError);
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
      searchWord,
      retry,
    }),
    [query, entries, loading, error, history, searchWord, retry],
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
