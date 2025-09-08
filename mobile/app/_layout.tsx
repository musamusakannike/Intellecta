import { Stack, SplashScreen } from "expo-router";
import { useEffect } from "react";
import "./global.css";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "SpaceGrotesk": require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk-SemiBold.ttf"),
    "SpaceGrotesk-Light": require("../assets/fonts/SpaceGrotesk-Light.ttf"),
    "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
  });
  useEffect(() => {
    if (error) throw error;
    if (!fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#100A1F" }}>
      <StatusBar backgroundColor={"#100A1F"} barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
