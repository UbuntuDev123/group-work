import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState("kelvinekiganga999@gmail.com");
  const [darkMode, setDarkMode] = useState(false);

  /* Load saved data */
  useEffect(() => {
    (async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      const savedDark = await AsyncStorage.getItem("darkMode");
      if (savedImage) setImage(savedImage);
      if (savedDark) setDarkMode(savedDark === "true");
    })();
  }, []);

  /* Pick image */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem("profileImage", result.assets[0].uri);
    }
  };

  /* Toggle dark mode */
  const toggleDark = async () => {
    const value = !darkMode;
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", String(value));
  };

  /* Sign out */
  const signOut = async () => {
    await AsyncStorage.clear();
    router.replace("/Signin");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0A0F2C" : "#fff" },
      ]}
    >
      {/* Profile */}
      <TouchableOpacity onPress={pickImage} style={styles.profileRow}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>KI</Text>
          </View>
        )}
        <View>
          <Text style={[styles.name, { color: darkMode ? "#fff" : "#000" }]}>
            Kelvine Inganga
          </Text>
          <Text style={{ color: "#888" }}>{email}</Text>
        </View>
      </TouchableOpacity>

      {/* Dark mode */}
      <View style={styles.row}>
        <Text style={{ color: darkMode ? "#fff" : "#000" }}>Dark mode</Text>
        <Switch value={darkMode} onValueChange={toggleDark} />
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.row} onPress={signOut}>
        <Text style={{ color: "red" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0A0F2C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
});
