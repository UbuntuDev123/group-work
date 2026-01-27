import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Admin() {
  const [receiptType, setReceiptType] = useState("Uploaded");
  const [country, setCountry] = useState("All");
  const [user, setUser] = useState("All");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Ionicons name="settings-outline" size={22} color="#8B0000" />
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

            <TouchableOpacity style={styles.linkBtn}>
              <Text style={styles.linkText}>View Receipt</Text>
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
            <Text style={styles.bold}>John Doe</Text>
            <Text style={styles.muted}>john@email.com</Text>
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
      style={[styles.chip, active && { backgroundColor: "#8B0000" }]}
    >
      <Text style={[styles.chipText, active && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  scroll: { padding: 15 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
  },

  title: { fontSize: 16, fontWeight: "bold" },

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

  linkBtn: { marginTop: 10 },
  linkText: { color: "#0B3F73", fontWeight: "bold" },

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
