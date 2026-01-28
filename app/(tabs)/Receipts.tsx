import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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

type Receipt = {
  reference: string;
  date: string;
  amount: string;
  status: string;
};

const USERS = ["Your Name", "Colleague 1", "Colleague 2"];
const PENDING_RECEIPTS: Receipt[] = [
  {
    reference: "001",
    date: "01/10/2026",
    amount: "KES 5,000",
    status: "Pending",
  },
  {
    reference: "002",
    date: "05/10/2026",
    amount: "KES 12,000",
    status: "Pending",
  },
];
const UNCLEARED_TRANSFERS: Receipt[] = [
  {
    reference: "T001",
    date: "02/10/2026",
    amount: "KES 8,000",
    status: "Uncleared",
  },
];

export default function ReceiptPortal() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(USERS[0]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#8B0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receipt Portal</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* USER SWITCH */}
          <View style={styles.filterCard}>
            <Text style={styles.filterLabel}>Clear Receipts For:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={(value) => setSelectedUser(value)}
              >
                {USERS.map((user, i) => (
                  <Picker.Item key={i} label={user} value={user} />
                ))}
              </Picker>
            </View>
          </View>

          {/* PENDING RECEIPTS */}
          <Text style={styles.sectionHeader}>Pending Receipts</Text>
          {PENDING_RECEIPTS.map((receipt, i) => (
            <View key={i} style={styles.receiptCard}>
              <Text style={styles.label}>Reference: {receipt.reference}</Text>
              <Text style={styles.label}>Date: {receipt.date}</Text>
              <Text style={styles.amount}>Amount: {receipt.amount}</Text>
              <Text style={styles.status}>{receipt.status}</Text>

              <TouchableOpacity style={styles.uploadBtn}>
                <FontAwesome name="upload" size={16} color="#fff" />
                <Text style={styles.uploadBtnText}>Upload Receipt</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* UNCLEARED TRANSFERS */}
          <Text style={styles.sectionHeader}>Uncleared Transfers</Text>
          {UNCLEARED_TRANSFERS.map((transfer, i) => (
            <View key={i} style={styles.receiptCard}>
              <Text style={styles.label}>Reference: {transfer.reference}</Text>
              <Text style={styles.label}>Date: {transfer.date}</Text>
              <Text style={styles.amount}>Amount: {transfer.amount}</Text>
              <Text style={styles.status}>{transfer.status}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
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
  description: { marginVertical: 10, fontSize: 13, color: "#555" },
  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  filterLabel: { fontSize: 12, color: "#666", marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionHeader: { fontSize: 14, fontWeight: "bold", marginVertical: 10 },
  receiptCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: { fontSize: 13, color: "#333" },
  amount: { fontSize: 14, fontWeight: "bold", color: "#0B3F73" },
  status: { fontSize: 13, fontWeight: "bold", color: "#8B0000", marginTop: 5 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B3F73",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadBtnText: { color: "#fff", marginLeft: 5, fontWeight: "bold" },
  profileCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  profilePicture: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 10 },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  textArea: { height: 80, textAlignVertical: "top" },
});
