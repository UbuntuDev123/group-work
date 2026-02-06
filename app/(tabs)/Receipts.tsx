import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- CONFIG ---------- */
const API_URL = "https://fhserver.org.fh260.org";

/* ---------- TYPES ---------- */
type Receipt = {
  reference: number;
  amount: number;
  balance: number;
  currency_code: string;
  submission_time: string;
};

type User = {
  Id: string;
  name: string;
};

export default function ReceiptPortal() {
  const router = useRouter();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  /* ---------- FETCH USERS ---------- */
  const loadUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        router.replace("/");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/same-country`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data: User[] = await res.json();
      setUsers(data);

      // Set current user as default
      const currentUser = await AsyncStorage.getItem("user");
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        setSelectedUser(parsed.Id);
      } else if (data.length > 0) {
        setSelectedUser(data[0].Id);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed loading users";
      Alert.alert("Error", message);
    }
  };

  /* ---------- FETCH RECEIPTS ---------- */
  const loadReceipts = async (userId: string) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        router.replace("/");
        return;
      }

      const res = await fetch(
        `${API_URL}/api/receipts/pending?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch receipts");

      const data: Receipt[] = await res.json();
      setReceipts(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed loading receipts";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) loadReceipts(selectedUser);
  }, [selectedUser]);

  /* ---------- MONEY FORMAT ---------- */
  const formatMoney = (amt: number, code: string) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code || "KES",
    }).format(amt);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt Portal</Text>
      </View>

      {/* USER SELECTOR */}
      <View style={styles.userSelectorContainer}>
        <Text style={styles.userSelectorLabel}>Select User:</Text>
        <ScrollView horizontal>
          {users.map((u) => (
            <TouchableOpacity
              key={u.Id}
              style={[
                styles.userButton,
                selectedUser === u.Id && styles.userButtonSelected,
              ]}
              onPress={() => setSelectedUser(u.Id)}
            >
              <Text
                style={[
                  styles.userButtonText,
                  selectedUser === u.Id && styles.userButtonTextSelected,
                ]}
              >
                {u.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Pending Receipts</Text>

        {receipts.length === 0 && (
          <Text style={styles.empty}>No pending receipts 🎉</Text>
        )}

        {receipts.map((r) => (
          <View key={r.reference} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.ref}>Ref #{r.reference}</Text>
              <Text style={styles.date}>
                {new Date(r.submission_time).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.amount}>
              {formatMoney(r.amount, r.currency_code)}
            </Text>

            <Text style={styles.balance}>
              Balance: {formatMoney(r.balance, r.currency_code)}
            </Text>

            <TouchableOpacity style={styles.uploadBtn}>
              <FontAwesome name="upload" size={14} color="#fff" />
              <Text style={styles.uploadText}>Upload Receipt</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f2f2f2" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#fff",
    paddingTop: 38,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: { fontSize: 16, fontWeight: "bold" },

  userSelectorContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  userSelectorLabel: { fontWeight: "bold", marginBottom: 5 },
  userButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  userButtonSelected: { backgroundColor: "#0B3F73" },
  userButtonText: { color: "#333" },
  userButtonTextSelected: { color: "#fff" },

  content: { padding: 15 },

  section: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  ref: { fontWeight: "bold" },
  date: { fontSize: 12, color: "#666" },

  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B3F73",
    marginVertical: 5,
  },

  balance: { fontSize: 13, color: "#444" },

  uploadBtn: {
    marginTop: 10,
    backgroundColor: "#0B3F73",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  uploadText: { color: "#fff", fontWeight: "bold" },
});
