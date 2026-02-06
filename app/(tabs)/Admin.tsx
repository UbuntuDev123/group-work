import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Admin() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [receiptType, setReceiptType] = useState("Uploaded");
  const [country, setCountry] = useState("All");
  const [user, setUser] = useState("All");

  /* ========= SAFE AUTHORIZATION CHECK ========= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");

        if (!token || !userStr) {
          Alert.alert("Access denied", "Please login first.");
          router.replace("/");
          return;
        }

        let parsedUser: any;

        try {
          parsedUser = JSON.parse(userStr);
        } catch {
          Alert.alert("Session error", "Please login again.");
          router.replace("/");
          return;
        }

        // Handles all backend variations safely
        const userCountry =
          parsedUser.country ||
          parsedUser.user?.country ||
          parsedUser.profile?.country ||
          "";

        if (String(userCountry).toUpperCase() !== "USA") {
          Alert.alert(
            "Not authorized",
            "You are not allowed to view this page.",
          );
          router.replace("/home");
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.log("Auth failed:", err);
        Alert.alert("Error", "Authentication failed.");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading || !allowed) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#8B0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* ===== RECEIPTS ===== */}
          <Text style={styles.sectionTitle}>Receipts</Text>

          <View style={styles.filtersRow}>
            {["Uploaded", "Pending", "Transferred"].map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={receiptType === item}
                onPress={() => setReceiptType(item)}
              />
            ))}
          </View>

          <View style={styles.filtersRow}>
            <FilterChip label={`Country: ${country}`} />
            <FilterChip label={`User: ${user}`} />
          </View>

          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.card}>
              <Row label="Receipt #" value="93" />
              <Row label="Date" value="25/09/2025" />
              <Row label="Total" value="UGX 1,400,000" amount />
              <Row label="Balance" value="UGX 0.00" balance />
              <Row label="Category" value="Fuel" />
              <Row label="Applicant" value="Michael Mutua" />

              <TouchableOpacity style={styles.viewBtn}>
                <MaterialIcons name="receipt" size={18} color="#fff" />
                <Text style={styles.viewBtnText}>View Receipt</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* ===== TRANSFERS ===== */}
          <Text style={styles.sectionTitle}>Transfers</Text>

          {[1, 2].map((_, i) => (
            <View key={i} style={styles.card}>
              <Row label="Transfer Ref" value="TRX-234" />
              <Row label="Receipt Ref" value="93" />
              <Row label="Amount" value="UGX 500,000" amount />
              <Row label="Applicant" value="Michael Mutua" />
            </View>
          ))}

          {/* ===== PENDING SIGNUPS ===== */}
          <Text style={styles.sectionTitle}>Pending Signup Requests</Text>

          {[1, 2].map((_, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.bold}>Gorety</Text>
              <Text style={styles.muted}>gorety@email.com</Text>
              <Text style={styles.muted}>Kenya • 25 Jan 2026</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.rejectBtn}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ===== SMALL COMPONENTS ===== */
function FilterChip({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: "#0B733F" }]}
    >
      <Text style={[styles.chipText, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Row({ label, value, amount, balance }: any) {
  return (
    <View style={styles.cardRow}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text
        style={[
          styles.cardValue,
          amount && styles.amount,
          balance && styles.balance,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  container: { flex: 1 },
  scroll: { padding: 15 },

  header: {
    backgroundColor: "#fff",
    paddingTop: 38,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },

  filtersRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },

  chip: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: { fontSize: 12 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardLabel: { color: "#666", fontSize: 12 },
  cardValue: { fontSize: 13 },

  amount: { color: "#8B0000", fontWeight: "bold" },
  balance: { color: "green", fontWeight: "bold" },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B3F73",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  viewBtnText: { color: "#fff", marginLeft: 6, fontWeight: "bold" },

  bold: { fontWeight: "bold" },
  muted: { color: "#666", fontSize: 12 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  approveBtn: {
    backgroundColor: "#0B3F73",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },

  rejectBtn: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "bold" },
});
