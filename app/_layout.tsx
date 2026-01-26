import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login first */}
      <Stack.Screen name="Signin" />

      {/* Main app */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
