import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

type Receipt = {
  reference: string;
  date: string;
  amount: string;
  balance: string;
  applicant: string;
};

const RECEIPTS: Receipt[] = [
  {
    reference: "125",
    date: "11/25/2025",
    amount: "KES 48,000.00",
    balance: "KES 0.00",
    applicant: "Kelvine",
  },
  {
    reference: "126",
    date: "10/12/2025",
    amount: "KES 30,000.00",
    balance: "KES 0.00",
    applicant: "Kelvine",
  },
];

export default function Downloads() {
  const router = useRouter();
  const [duration, setDuration] = useState("ANNUALLY");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER WITH BACK ARROW */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#8B0000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Downloadable Receipts</Text>

        {/* Spacer for center alignment */}
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* FILTER */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>Select Receipt Duration</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={duration}
              onValueChange={(value) => setDuration(value)}
            >
              <Picker.Item label="Annually" value="ANNUALLY" />
              <Picker.Item label="Three-Quarter" value="THREE-QUARTER" />
              <Picker.Item label="Half-Yearly" value="HALF-YEARLY" />
              <Picker.Item label="Quarterly" value="QUARTERLY" />
              <Picker.Item label="1 Month" value="1-MONTH" />
            </Picker>
          </View>
        </View>

        {/* RECEIPTS */}
        {RECEIPTS.map((item, index) => (
          <View key={index} style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.label}>Reference</Text>
              <Text style={styles.value}>{item.reference}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{item.date}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Total Amount</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Balance</Text>
              <Text style={styles.balance}>{item.balance}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.label}>Applicant</Text>
              <Text style={styles.value}>{item.applicant}</Text>
            </View>

            <TouchableOpacity style={styles.viewBtn}>
              <MaterialIcons name="receipt" size={18} color="#fff" />
              <Text style={styles.viewBtnText}>View Receipt</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  scroll: {
    padding: 15,
  },

  header: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  filterLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },

  receiptCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  value: {
    fontSize: 13,
    fontWeight: "500",
  },

  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0B3F73",
  },

  balance: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },

  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  viewBtnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },
});
