import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login */}
      <Stack.Screen name="Signin" />

      {/* Main App */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
