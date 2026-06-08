import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export async function lightImpact() {
  if (Platform.OS !== "web") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export async function mediumImpact() {
  if (Platform.OS !== "web") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export async function successNotification() {
  if (Platform.OS !== "web") {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

export async function errorNotification() {
  if (Platform.OS !== "web") {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export async function selectionFeedback() {
  if (Platform.OS !== "web") {
    await Haptics.selectionAsync();
  }
}
