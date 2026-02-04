import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Admin() {
  const router = useRouter();
  const [receiptType, setReceiptType] = useState("Uploaded");
  const [country, setCountry] = useState("All");
  const [user, setUser] = useState("All");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* HEADER (same as Downloads) */}
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
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Receipt #</Text>
                <Text style={styles.cardValue}>93</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Date</Text>
                <Text style={styles.cardValue}>25/09/2025</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Total</Text>
                <Text style={styles.amount}>UGX 1,400,000</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Balance</Text>
                <Text style={styles.balance}>UGX 0.00</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Category</Text>
                <Text style={styles.cardValue}>Fuel</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Applicant</Text>
                <Text style={styles.cardValue}>Michael Mutua</Text>
              </View>

              {/* VIEW RECEIPT BUTTON (same style as Downloads) */}
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
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Transfer Ref</Text>
                <Text style={styles.cardValue}>TRX-234</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Receipt Ref</Text>
                <Text style={styles.cardValue}>93</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Amount</Text>
                <Text style={styles.amount}>UGX 500,000</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Applicant</Text>
                <Text style={styles.cardValue}>Michael Mutua</Text>
              </View>
            </View>
          ))}

          {/* ===== PENDING SIGNUPS ===== */}
          <Text style={styles.sectionTitle}>Pending Signup Requests</Text>

          {[1, 2].map((_, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.bold}>Gorety</Text>
              <Text style={styles.muted}>Gorety@email.com</Text>
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

/* ===== FILTER CHIP ===== */
function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
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

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  container: { flex: 1 },

  scroll: { padding: 15 },

  header: {
    backgroundColor: "#fff",
    paddingTop: 38, // ≈ 1 cm from top
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: { marginRight: 8 },

  headerTitle: { fontSize: 16, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

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

  viewBtnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },

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
