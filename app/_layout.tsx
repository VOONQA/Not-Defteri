import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MenuButton } from "../src/components/notes/MenuButton";
import { useSettings } from '../src/contexts/SettingsContext';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

function StackNavigator() {
  const { fontFamily } = useSettings();
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontFamily: fontFamily === 'system' ? undefined : fontFamily,
        },
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="folders" 
        options={{
          title: "Klasörler",
          animation: "slide_from_right",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push("/trash")}
              style={{ paddingHorizontal: 15 }}
            >
              <Ionicons name="trash-outline" size={24} color="#2c3e50" />
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen 
        name="new-note" 
        options={{
          title: "Yeni Not",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="note-detail" 
        options={{
          title: "Not Detayı",
          animation: "slide_from_right",
          headerRight: () => <MenuButton />
        }}
      />
      <Stack.Screen 
        name="settings" 
        options={{
          title: "Ayarlar",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="trash" 
        options={{
          title: "Çöp Kutusu",
          animation: "slide_from_right"
        }} 
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <SettingsProvider>
      <StackNavigator />
      <StatusBar style="auto" />
    </SettingsProvider>
  );
}
