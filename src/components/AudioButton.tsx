import { Ionicons } from "@expo/vector-icons";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";
import { lightImpact, mediumImpact } from "../utils/haptics";
import { AudioWave } from "./AudioWave";

interface AudioButtonProps {
  audioUrl: string;
  label?: string;
  compact?: boolean;
}

type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

const SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AudioButton({ audioUrl, label, compact = false }: AudioButtonProps) {
  const { colors } = useTheme();
  const player = useAudioPlayer(audioUrl, { downloadFirst: true });
  const status = useAudioPlayerStatus(player);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [showControls, setShowControls] = useState(false);

  const scale = useSharedValue(1);

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    if (player && speed !== 1) {
      player.setPlaybackRate(speed);
    }
  }, [player, speed]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 400 });
    void lightImpact();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePlay = async () => {
    setPlaybackError(null);
    try {
      if (status.currentTime > 0) {
        player.seekTo(0);
      }
      void mediumImpact();
      player.play();
      setShowControls(true);
    } catch {
      setPlaybackError("Couldn't play audio");
    }
  };

  const handlePause = () => {
    void lightImpact();
    player.pause();
  };

  const handleStop = () => {
    void lightImpact();
    player.pause();
    player.seekTo(0);
    setShowControls(false);
  };

  const handleTogglePlayPause = async () => {
    if (status.playing) {
      handlePause();
    } else {
      await handlePlay();
    }
  };

  const cycleSpeed = () => {
    void lightImpact();
    const currentIndex = SPEEDS.indexOf(speed);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    const newSpeed = SPEEDS[nextIndex];
    setSpeed(newSpeed);
    player.setPlaybackRate(newSpeed);
  };

  const formatSpeed = (s: PlaybackSpeed) => {
    if (s === 1) return "1x";
    if (s === 0.5) return "0.5x";
    if (s === 0.75) return "0.75x";
    return `${s}x`;
  };

  // Compact version - just a simple button with wave
  if (compact) {
    return (
      <View className="flex-row items-center gap-2">
        <AnimatedPressable
          onPress={() => void handleTogglePlayPause()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={label ?? "Play pronunciation"}
          style={buttonAnimatedStyle}
          className="h-11 w-11 items-center justify-center rounded-full bg-black"
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
        </AnimatedPressable>

        {status.playing && (
          <AudioWave
            isPlaying={status.playing}
            barCount={4}
            barWidth={3}
            minHeight={6}
            maxHeight={18}
            color={colors.purple}
          />
        )}
      </View>
    );
  }

  // Full version with controls
  return (
    <View className="gap-3">
      {/* Main Player Card */}
      <View
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        className="overflow-hidden rounded-2xl border"
      >
        {/* Top bar with wave visualization */}
        <View
          style={{ backgroundColor: colors.lavender }}
          className="flex-row items-center justify-center gap-4 px-4 py-3"
        >
          <AudioWave
            isPlaying={status.playing}
            barCount={7}
            barWidth={4}
            barGap={4}
            minHeight={8}
            maxHeight={28}
            color={colors.purple}
          />
        </View>

        {/* Controls */}
        <View className="flex-row items-center justify-between px-4 py-3">
          {/* Speed Control */}
          <Pressable
            onPress={cycleSpeed}
            style={{ backgroundColor: colors.backgroundSubtle }}
            className="rounded-full px-3 py-1.5"
          >
            <Text style={{ color: colors.text }} className="text-sm font-semibold">
              {formatSpeed(speed)}
            </Text>
          </Pressable>

          {/* Play/Pause/Stop Controls */}
          <View className="flex-row items-center gap-2">
            {/* Stop */}
            <Pressable
              onPress={handleStop}
              style={{ backgroundColor: colors.backgroundSubtle }}
              className="h-10 w-10 items-center justify-center rounded-full"
            >
              <Ionicons name="stop" size={18} color={colors.textSecondary} />
            </Pressable>

            {/* Play/Pause - Main Button */}
            <AnimatedPressable
              onPress={() => void handleTogglePlayPause()}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={buttonAnimatedStyle}
              className="h-14 w-14 items-center justify-center rounded-full bg-black"
            >
              {status.isBuffering ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={status.playing ? "pause" : "play"}
                  size={24}
                  color="#FFFFFF"
                />
              )}
            </AnimatedPressable>

            {/* Replay */}
            <Pressable
              onPress={() => {
                void lightImpact();
                player.seekTo(0);
                player.play();
              }}
              style={{ backgroundColor: colors.backgroundSubtle }}
              className="h-10 w-10 items-center justify-center rounded-full"
            >
              <Ionicons name="refresh" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Status indicator */}
          <View className="w-12 items-end">
            {status.playing && (
              <View className="flex-row items-center gap-1">
                <View className="h-2 w-2 rounded-full bg-verbivy-success" />
                <Text style={{ color: colors.success }} className="text-xs font-medium">
                  Live
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Speed presets row */}
        {showControls && (
          <View
            style={{ backgroundColor: colors.backgroundSubtle }}
            className="flex-row items-center justify-center gap-2 px-4 py-2"
          >
            {SPEEDS.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  void lightImpact();
                  setSpeed(s);
                  player.setPlaybackRate(s);
                }}
                style={{
                  backgroundColor: speed === s ? colors.purple : "transparent",
                }}
                className="rounded-full px-3 py-1"
              >
                <Text
                  style={{ color: speed === s ? "#FFFFFF" : colors.textSecondary }}
                  className="text-xs font-medium"
                >
                  {formatSpeed(s)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Error Message */}
      {playbackError && (
        <View
          style={{ backgroundColor: `${colors.error}15` }}
          className="flex-row items-center gap-2 rounded-xl px-4 py-2"
        >
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={{ color: colors.error }} className="text-sm">
            {playbackError}
          </Text>
        </View>
      )}
    </View>
  );
}
