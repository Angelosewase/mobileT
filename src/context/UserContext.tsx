import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getItem, removeItem, setItem } from "../utils/storage";

export type LearningGoal = "casual" | "regular" | "serious" | "intensive";
export type Interest =
  | "vocabulary"
  | "pronunciation"
  | "etymology"
  | "idioms"
  | "academic"
  | "creative";

export interface UserProfile {
  name: string;
  learningGoal: LearningGoal;
  interests: Interest[];
  dailyWordGoal: number;
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

interface UserContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (profile: Omit<UserProfile, "hasCompletedOnboarding" | "createdAt">) => Promise<void>;
  resetProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

const STORAGE_KEY = "lexitech_user_profile";

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!profile) return;
      const newProfile = { ...profile, ...updates };
      await saveProfile(newProfile);
    },
    [profile],
  );

  const completeOnboarding = useCallback(
    async (profileData: Omit<UserProfile, "hasCompletedOnboarding" | "createdAt">) => {
      const newProfile: UserProfile = {
        ...profileData,
        hasCompletedOnboarding: true,
        createdAt: new Date().toISOString(),
      };
      await saveProfile(newProfile);
    },
    [],
  );

  const resetProfile = useCallback(async () => {
    try {
      await removeItem(STORAGE_KEY);
      setProfile(null);
    } catch (error) {
      console.error("Failed to reset profile:", error);
    }
  }, []);

  const hasCompletedOnboarding = profile?.hasCompletedOnboarding ?? false;

  const value = useMemo(
    () => ({
      profile,
      isLoading,
      hasCompletedOnboarding,
      updateProfile,
      completeOnboarding,
      resetProfile,
    }),
    [profile, isLoading, hasCompletedOnboarding, updateProfile, completeOnboarding, resetProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
