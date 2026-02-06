import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= BACKEND ================= */
const BASE_URL = "https://fhserver.org.fh260.org";

/* ================= HELPERS ================= */
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPin = (pin: string) => {
  if (!/^\d{4}$/.test(pin)) return false;
  for (let i = 0; i < pin.length - 1; i++) {
    if (+pin[i + 1] - +pin[i] === 1) return false;
  }
  return true;
};

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
};

/* ================= COMPONENT ================= */
export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "request" | "code">("login");
  const [loading, setLoading] = useState(false);

  const [credential, setCredential] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  const [code, setCode] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  /* ================= FINGERPRINT LOGIN ================= */
  const handleFingerprint = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) throw new Error("Fingerprint not supported");

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) throw new Error("No fingerprint enrolled");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in",
      });

      if (result.success) {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Session expired", "Please login again.");
          return;
        }

        router.replace("/(tabs)/Home");
      }
    } catch (err: unknown) {
      Alert.alert("Authentication failed", getErrorMessage(err));
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!credential || !pin) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, pin }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      // Save user profile
      await AsyncStorage.setItem(
        "userProfile",
        JSON.stringify({
          fullName: data.fullName || credential,
          email: credential,
        }),
      );

      router.replace("/(tabs)/Home");
    } catch (err: unknown) {
      Alert.alert("Login failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!isValidPin(pin)) {
      Alert.alert("Error", "Invalid PIN");
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert("Error", "PINs do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, email, pin, country }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      Alert.alert("Success", "Registration complete");
      setMode("login");
    } catch (err: unknown) {
      Alert.alert("Registration failed", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0B3F73" />}

      {mode === "login" && (
        <>
          <Text style={styles.title}>Welcome</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={credential}
            onChangeText={setCredential}
          />

          <View style={styles.passwordBox}>
            <TextInput
              style={styles.inputInside}
              placeholder="PIN"
              secureTextEntry={!showPin}
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
            />
            <Ionicons
              name={showPin ? "eye-off-outline" : "eye-outline"}
              size={22}
              onPress={() => setShowPin(!showPin)}
            />
          </View>

          <TouchableOpacity style={styles.loginActive} onPress={handleLogin}>
            <Text style={styles.loginText}>Let me in</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 20, textAlign: "center", marginBottom: 25 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  inputInside: { flex: 1, padding: 10 },
  loginActive: {
    backgroundColor: "#0B3F73",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  loginText: { color: "#fff" },
  touchId: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  touchText: { marginLeft: 8, color: "#0B3F73" },
});
