import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-blue-600">
            NativeWind works
          </Text>
          <Text className="text-center text-base text-slate-600">
            If this text is blue and centered on a light gray background, your
            setup is correct.
          </Text>
        </View>

        <View className="w-full max-w-sm gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Text className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Test utilities
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-emerald-100 px-3 py-1">
              <Text className="text-sm font-medium text-emerald-800">flex</Text>
            </View>
            <View className="rounded-full bg-amber-100 px-3 py-1">
              <Text className="text-sm font-medium text-amber-800">colors</Text>
            </View>
            <View className="rounded-full bg-violet-100 px-3 py-1">
              <Text className="text-sm font-medium text-violet-800">spacing</Text>
            </View>
          </View>
          <Text className="text-sm text-slate-500">
            Edit{" "}
            <Text className="font-mono text-xs text-slate-700">src/app/index.tsx</Text>{" "}
            and change any className to verify hot reload.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
