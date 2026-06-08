import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface AudioButtonProps {
  audioUrl: string;
  label?: string;
  compact?: boolean;
}

export function AudioButton({ audioUrl, label, compact = false }: AudioButtonProps) {
  const player = useAudioPlayer(audioUrl, { downloadFirst: true });
  const status = useAudioPlayerStatus(player);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const handlePress = async () => {
    setPlaybackError(null);

    try {
      if (status.playing) {
        player.pause();
        return;
      }

      if (status.currentTime > 0) {
        player.seekTo(0);
      }

      player.play();
    } catch {
      setPlaybackError("Couldn't play pronunciation");
    }
  };

  if (compact) {
    return (
      <Pressable
        onPress={() => void handlePress()}
        accessibilityRole="button"
        accessibilityLabel={label ?? "Play pronunciation"}
        className="h-11 w-11 items-center justify-center rounded-full bg-black active:opacity-90"
      >
        {status.isBuffering ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Ionicons
            name={status.playing ? "pause" : "volume-high"}
            size={20}
            color="#FFFFFF"
          />
        )}
      </Pressable>
    );
  }

  return (
    <View className="items-center gap-2">
      <Pressable
        onPress={() => void handlePress()}
        accessibilityRole="button"
        accessibilityLabel={label ?? "Play pronunciation"}
        className="min-h-[56px] min-w-[140px] flex-row items-center justify-center gap-2 rounded-full bg-black px-6 active:opacity-90"
      >
        {status.isBuffering ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Ionicons
            name={status.playing ? "pause" : "play"}
            size={20}
            color="#FFFFFF"
          />
        )}
        <Text className="text-base font-semibold text-white">
          {status.playing ? "Playing" : "Play"}
        </Text>
      </Pressable>
      {playbackError ? (
        <Text className="text-sm text-verbivy-error">{playbackError}</Text>
      ) : null}
    </View>
  );
}
