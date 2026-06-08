import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { getItem, setItem } from "../utils/storage";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: "#FFFFFF",
  backgroundSubtle: "#F8F8FA",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  text: "#000000",
  textSecondary: "#6B6B70",
  textTertiary: "#AEAEB2",
  border: "#E5E5EA",
  lavender: "#E8DFF5",
  lavenderStrong: "#C9B8E8",
  purple: "#9B7FD4",
  peach: "#FFE8D9",
  mint: "#D4F0E4",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
};

const darkColors = {
  background: "#000000",
  backgroundSubtle: "#1C1C1E",
  surface: "#1C1C1E",
  surfaceElevated: "#2C2C2E",
  text: "#FFFFFF",
  textSecondary: "#AEAEB2",
  textTertiary: "#6B6B70",
  border: "#38383A",
  lavender: "#2D2640",
  lavenderStrong: "#3D3260",
  purple: "#B19CD9",
  peach: "#3D2D25",
  mint: "#1D3029",
  error: "#FF453A",
  success: "#30D158",
  warning: "#FF9F0A",
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "lexitech_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setModeState(stored);
      }
      setIsLoaded(true);
    });
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    setItem(STORAGE_KEY, newMode);
  }, []);

  const isDark = useMemo(() => {
    if (mode === "system") {
      return systemColorScheme === "dark";
    }
    return mode === "dark";
  }, [mode, systemColorScheme]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const value = useMemo(
    () => ({ mode, isDark, setMode, colors }),
    [mode, isDark, setMode, colors],
  );

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
