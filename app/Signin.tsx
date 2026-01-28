import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  /* ---------- FINGERPRINT LOGIN ---------- */
  const handleFingerprint = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("Error", "Fingerprint not supported on this device");
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert("Error", "No fingerprint enrolled");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Sign in with Touch ID",
      fallbackLabel: "Use Password",
    });

    if (result.success) {
      setAuthenticated(true);
      router.replace("/(tabs)/Home");
    }
  };

  /* ---------- PASSWORD LOGIN ---------- */
  const handleLogin = () => {
    if (!password.length) {
      Alert.alert("Error", "Enter your password");
      return;
    }
    router.replace("/(tabs)/Home");
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.title}>Welcome</Text>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={!show}
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#8B0000"
            onPress={() => setShow(!show)}
          />
        </View>
      </View>

      {/* Forgot password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Touch ID */}
      <TouchableOpacity style={styles.touchId} onPress={handleFingerprint}>
        <Ionicons name="finger-print" size={22} color="#0B3F73" />
        <Text style={styles.touchText}> Sign in with Touch ID</Text>
      </TouchableOpacity>

      {/* Login */}
      <TouchableOpacity
        style={[
          styles.login,
          (password.length > 0 || authenticated) && styles.loginActive,
        ]}
        disabled={!password.length && !authenticated}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Let me in</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#0B3F73",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B3F73",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 40,
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgot: {
    color: "#8B0000",
    textAlign: "center",
    marginVertical: 25,
  },
  touchId: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0B3F73",
    padding: 14,
    borderRadius: 30,
    marginBottom: 15,
  },
  touchText: {
    color: "#0B3F73",
    fontSize: 16,
  },
  login: {
    backgroundColor: "#ddd",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  loginActive: {
    backgroundColor: "#0B3F73",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
  },
});
