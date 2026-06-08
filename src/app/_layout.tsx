import "../global.css";

import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HistoryDrawer } from "../components/HistoryDrawer";
import { DictionaryProvider } from "../context/DictionaryContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DictionaryProvider>
        <Drawer
          drawerContent={(props) => <HistoryDrawer {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTintColor: "#000000",
            headerTitleStyle: { fontWeight: "600" },
            drawerStyle: { backgroundColor: "#FFFFFF", width: 300 },
            drawerActiveTintColor: "#000000",
            drawerInactiveTintColor: "#6B6B70",
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: "LexiTech Dictionary",
              drawerLabel: "Search",
            }}
          />
        </Drawer>
      </DictionaryProvider>
    </GestureHandlerRootView>
  );
}
