import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import { View } from "react-native";

interface IllustrationProps {
  size?: number;
}

export function BookIllustration({ size = 120 }: IllustrationProps) {
  const scale = size / 120;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G transform={`scale(${scale})`}>
          {/* Background circle */}
          <Circle cx="60" cy="60" r="55" fill="#E8DFF5" opacity={0.5} />
          
          {/* Book base */}
          <Path
            d="M25 35 L60 28 L95 35 L95 90 L60 97 L25 90 Z"
            fill="#FFFFFF"
            stroke="#9B7FD4"
            strokeWidth="2"
          />
          
          {/* Book spine */}
          <Path d="M60 28 L60 97" stroke="#9B7FD4" strokeWidth="2" />
          
          {/* Left page lines */}
          <Path d="M32 45 L55 40" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M32 55 L55 50" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M32 65 L55 60" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M32 75 L50 71" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          
          {/* Right page lines */}
          <Path d="M65 40 L88 45" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M65 50 L88 55" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M65 60 L88 65" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          <Path d="M65 71 L83 75" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
          
          {/* Magnifying glass */}
          <Circle cx="82" cy="25" r="12" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
          <Path d="M90 33 L100 43" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="82" cy="25" r="6" fill="none" stroke="#9B7FD4" strokeWidth="1.5" opacity={0.6} />
          
          {/* Decorative elements */}
          <Circle cx="20" cy="25" r="4" fill="#FFE8D9" />
          <Circle cx="100" cy="80" r="3" fill="#D4F0E4" />
          <Circle cx="15" cy="70" r="2.5" fill="#C9B8E8" />
        </G>
      </Svg>
    </View>
  );
}

export function SuccessIllustration({ size = 120 }: IllustrationProps) {
  const scale = size / 120;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G transform={`scale(${scale})`}>
          {/* Background circle */}
          <Circle cx="60" cy="60" r="50" fill="#D4F0E4" opacity={0.5} />
          
          {/* Inner circle */}
          <Circle cx="60" cy="60" r="35" fill="#FFFFFF" stroke="#34C759" strokeWidth="3" />
          
          {/* Checkmark */}
          <Path
            d="M42 60 L54 72 L78 48"
            fill="none"
            stroke="#34C759"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Celebration dots */}
          <Circle cx="25" cy="35" r="4" fill="#9B7FD4" />
          <Circle cx="95" cy="40" r="3" fill="#FFE8D9" />
          <Circle cx="30" cy="90" r="3" fill="#C9B8E8" />
          <Circle cx="90" cy="85" r="4" fill="#E8DFF5" />
          <Circle cx="15" cy="60" r="2.5" fill="#D4F0E4" />
          <Circle cx="105" cy="60" r="2.5" fill="#FFE8D9" />
          
          {/* Sparkles */}
          <Path d="M20 20 L22 25 L27 27 L22 29 L20 34 L18 29 L13 27 L18 25 Z" fill="#9B7FD4" />
          <Path d="M95 15 L96 18 L99 19 L96 20 L95 23 L94 20 L91 19 L94 18 Z" fill="#FFE8D9" />
        </G>
      </Svg>
    </View>
  );
}

export function SearchIllustration({ size = 80 }: IllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 80 80">
        {/* Background */}
        <Circle cx="40" cy="40" r="35" fill="#E8DFF5" opacity={0.3} />
        
        {/* Magnifying glass */}
        <Circle cx="35" cy="35" r="18" fill="#FFFFFF" stroke="#9B7FD4" strokeWidth="3" />
        <Path d="M48 48 L62 62" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
        
        {/* Inner reflection */}
        <Circle cx="30" cy="30" r="5" fill="none" stroke="#E8DFF5" strokeWidth="2" />
        
        {/* Text lines inside glass */}
        <Path d="M25 38 L45 38" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
        <Path d="M28 43 L40 43" stroke="#E5E5EA" strokeWidth="2" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function EmptyHistoryIllustration({ size = 100 }: IllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background */}
        <Circle cx="50" cy="50" r="45" fill="#E8DFF5" opacity={0.3} />
        
        {/* Clock face */}
        <Circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#9B7FD4" strokeWidth="2.5" />
        
        {/* Clock hands */}
        <Path d="M50 50 L50 30" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M50 50 L65 50" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        
        {/* Center dot */}
        <Circle cx="50" cy="50" r="3" fill="#9B7FD4" />
        
        {/* Hour markers */}
        <Circle cx="50" cy="25" r="2" fill="#C9B8E8" />
        <Circle cx="75" cy="50" r="2" fill="#C9B8E8" />
        <Circle cx="50" cy="75" r="2" fill="#C9B8E8" />
        <Circle cx="25" cy="50" r="2" fill="#C9B8E8" />
        
        {/* Decorative */}
        <Circle cx="15" cy="20" r="3" fill="#FFE8D9" />
        <Circle cx="85" cy="25" r="2.5" fill="#D4F0E4" />
      </Svg>
    </View>
  );
}

export function ErrorIllustration({ size = 100 }: IllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Background */}
        <Circle cx="50" cy="50" r="45" fill="#FFE8D9" opacity={0.4} />
        
        {/* Face circle */}
        <Circle cx="50" cy="50" r="32" fill="#FFFFFF" stroke="#6B6B70" strokeWidth="2.5" />
        
        {/* Eyes */}
        <Ellipse cx="38" cy="42" rx="4" ry="5" fill="#6B6B70" />
        <Ellipse cx="62" cy="42" rx="4" ry="5" fill="#6B6B70" />
        
        {/* Confused mouth */}
        <Path
          d="M35 62 Q42 58, 50 62 Q58 66, 65 62"
          fill="none"
          stroke="#6B6B70"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Question mark */}
        <Path
          d="M75 15 Q82 15, 82 22 Q82 28, 77 30 L77 35"
          fill="none"
          stroke="#9B7FD4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Circle cx="77" cy="40" r="2" fill="#9B7FD4" />
        
        {/* Decorative */}
        <Circle cx="18" cy="30" r="3" fill="#E8DFF5" />
        <Circle cx="12" cy="70" r="2.5" fill="#C9B8E8" />
      </Svg>
    </View>
  );
}

export function StreakFlame({ size = 24 }: IllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2C12 2 8 6 8 10C8 12 9 13.5 10 14.5C9 13 9.5 11 12 9C12 12 14 14 14 16C14 18 12.5 20 10 21C14 21 18 18 18 14C18 8 12 2 12 2Z"
          fill="#FF9500"
        />
        <Path
          d="M12 9C12 12 14 14 14 16C14 18 12.5 20 10 21C11 20 12 18.5 12 17C12 15 10 13 10 13C10 13 11 11 12 9Z"
          fill="#FFCC00"
        />
      </Svg>
    </View>
  );
}
