import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ===== BACKEND ===== */
const BASE_URL = "https://fhserver.org.fh260.org";

export default function Downloads() {
  const router = useRouter();

  const [duration, setDuration] = useState("ANNUALLY");
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReceipts = async (d = duration) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Login expired");
        router.replace("/");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/user/receipts?duration=${d}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text(); // DEBUG

      console.log("SERVER RESPONSE:", text);

      const data = JSON.parse(text);

      setReceipts(data.receipts || []);
    } catch (err) {
      console.log(err);
      Alert.alert("Failed loading downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  useEffect(() => {
    loadReceipts(duration);
  }, [duration]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0B3F73" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloadable Receipts</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* FILTER */}
        <View style={styles.filterCard}>
          <Text>Select Receipt Duration</Text>

          <Picker
            selectedValue={duration}
            onValueChange={(v) => setDuration(v)}
          >
            <Picker.Item label="Annually" value="ANNUALLY" />
            <Picker.Item label="Three-Quarter" value="THREE-QUARTER" />
            <Picker.Item label="Half-Yearly" value="HALF-YEARLY" />
            <Picker.Item label="Quarterly" value="QUARTERLY" />
            <Picker.Item label="1 Month" value="1-MONTH" />
          </Picker>
        </View>

        {receipts.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            No receipts found
          </Text>
        )}

        {receipts.map((r, i) => (
          <View key={i} style={styles.card}>
            <Text>Reference: {r.reference}</Text>
            <Text>Date: {r.submission_time}</Text>
            <Text>Total: {r.total_amount}</Text>
            <Text>Balance: {r.balance_amount}</Text>
            <Text>Applicant: {r.name}</Text>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => Linking.openURL(r.drive_link)}
            >
              <MaterialIcons name="receipt" size={18} color="#fff" />
              <Text style={{ color: "#fff", marginLeft: 6 }}>
                Download Receipt
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  scroll: { padding: 15 },

  header: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    marginLeft: 10,
    fontWeight: "bold",
  },

  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  btn: {
    marginTop: 10,
    backgroundColor: "#0B3F73",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
