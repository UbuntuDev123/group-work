import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BASE_URL = "https://fhserver.org.fh260.org";

export default function Profile() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------- Load profile data ---------- */
  useEffect(() => {
    (async () => {
      const savedDark = await AsyncStorage.getItem("darkMode");
      if (savedDark) setDarkMode(savedDark === "true");
      await loadProfile();
    })();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/Signin");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setName(data.name || "");
      setEmail(data.email || "");
      setRole(data.role || "");
      setBio(data.bio || "");
      if (data.profilePhoto) {
        setImage(data.profilePhoto);
        await AsyncStorage.setItem("profileImage", data.profilePhoto);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Pick new profile image ---------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  /* ---------- Save profile ---------- */
  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("data", JSON.stringify({ role, bio }));
      if (image && !image.startsWith("http")) {
        const filename = image.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        formData.append("profilePhoto", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save profile");
      }

      const data = await res.json();
      Alert.alert("Success", "Profile updated successfully!");
      if (data.profilePhoto) setImage(data.profilePhoto);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to save profile");
    }
  };

  /* ---------- Toggle dark mode ---------- */
  const toggleDark = async () => {
    const value = !darkMode;
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", value ? "true" : "false");
  };

  /* ---------- Logout ---------- */
  const signOut = async () => {
    await AsyncStorage.clear();
    router.replace("/Signin");
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0A0F2C" : "#fff" },
      ]}
    >
      {/* Profile Row */}
      <TouchableOpacity style={styles.profileRow} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {name
                ? name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </Text>
          </View>
        )}
        <View>
          <Text style={[styles.name, { color: darkMode ? "#fff" : "#000" }]}>
            {name}
          </Text>
          <Text style={{ color: "#888" }}>{email}</Text>
        </View>
      </TouchableOpacity>

      {/* Role */}
      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Role</Text>
        <TextInput
          value={role}
          onChangeText={setRole}
          placeholder="Enter role"
          placeholderTextColor="#888"
          style={[
            styles.input,
            { color: darkMode ? "#fff" : "#000", borderColor: "#ccc" },
          ]}
        />
      </View>

      {/* Bio */}
      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Enter bio"
          placeholderTextColor="#888"
          style={[
            styles.input,
            { color: darkMode ? "#fff" : "#000", borderColor: "#ccc" },
          ]}
        />
      </View>

      {/* Dark mode toggle */}
      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Dark mode</Text>
        <Switch value={darkMode} onValueChange={toggleDark} />
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0A0F2C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  name: { fontSize: 16, fontWeight: "600" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginLeft: 10,
  },
  saveBtn: {
    backgroundColor: "#0B3F73",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  signOutBtn: { alignItems: "center", padding: 15 },
  signOutText: { color: "red", fontWeight: "bold" },
});
