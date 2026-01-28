import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

// ⛔ Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const glowAnim = new Animated.Value(0); // For glowing background
  const textAnim = new Animated.Value(0); // For italic text animation

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await SplashScreen.hideAsync();

      // 🔹 Start background glow animation (loop)
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
      ).start();

      // 🔹 Start italic text animation (loop)
      Animated.loop(
        Animated.sequence([
          Animated.timing(textAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(textAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();

      // Show welcome screen for 10 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 10000); // 10000 ms = 10 seconds
    }

    prepare();
  }, []);

  if (showWelcome) {
    // Interpolate glow value for background color
    const backgroundColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#0B3F73", "#0B73FF"], // dark blue → bright blue
    });

    // Interpolate italic text animation (scale + opacity)
    const textStyle = {
      transform: [
        {
          scale: textAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          }),
        },
      ],
      opacity: textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      }),
    };

    return (
      <Animated.View style={[styles.welcomeContainer, { backgroundColor }]}>
        <Text style={styles.welcomeText}>WELCOME TO FH260</Text>
        <Animated.Text style={[styles.welcomeSubText, textStyle]}>
          Fund Request System
        </Animated.Text>
      </Animated.View>
    );
  }

  // 🚀 MAIN APP
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B3F73",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  welcomeSubText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
});
