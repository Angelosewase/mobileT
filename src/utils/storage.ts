import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webStorage: Record<string, string> = {};

export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return webStorage[key] ?? localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn("Storage getItem error:", error);
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      webStorage[key] = value;
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn("Storage setItem error:", error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      delete webStorage[key];
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn("Storage removeItem error:", error);
  }
}
