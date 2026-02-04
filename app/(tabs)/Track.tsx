import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- TYPES ---------- */
type Fund = {
  title: string;
  category: string;
  amount: string;
  status: string;
  date: string;
  action: string;
};

/* ---------- DATA ---------- */
const FUNDS: Fund[] = [
  {
    title: "Office Supplies",
    category: "Operations",
    amount: "KES 48,000",
    status: "Cleared",
    date: "25 Nov 2025",
    action: "None",
  },
  {
    title: "Travel Reimbursement",
    category: "Travel",
    amount: "KES 30,000",
    status: "Uploaded",
    date: "12 Oct 2025",
    action: "Verify Receipt",
  },
];

/* ---------- SCREEN ---------- */
export default function DisbursedFunds() {
  const router = useRouter();

  const [hideTotal, setHideTotal] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [hideAverage, setHideAverage] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

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

          <Text style={styles.headerTitle}>Disbursment</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* STATS */}
          <View style={styles.statsRow}>
            <StatCard
              title="Total Disbursed"
              value={hideTotal ? "****" : "KES 78,000"}
              icon="payments"
              onToggle={() => setHideTotal(!hideTotal)}
            />
            <StatCard
              title="Completed"
              value={hideCompleted ? "**" : "4 / 2"}
              icon="check-circle"
              onToggle={() => setHideCompleted(!hideCompleted)}
            />
            <StatCard
              title="Average"
              value={hideAverage ? "****" : "KES 39,000"}
              icon="calculate"
              onToggle={() => setHideAverage(!hideAverage)}
            />
          </View>

          {/* SEARCH & FILTER */}
          <View style={styles.filterCard}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={16} color="#666" />
              <TextInput
                placeholder="Search requests..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.pickerWrapper}>
              <Picker selectedValue={status} onValueChange={setStatus}>
                <Picker.Item label="All Status" value="all" />
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Uploaded" value="uploaded" />
                <Picker.Item label="Cleared" value="cleared" />
              </Picker>
            </View>
          </View>

          {/* FUNDS LIST */}
          {FUNDS.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <InfoRow label="Category" value={item.category} />
              <InfoRow label="Amount" value={item.amount} highlight />
              <InfoRow label="Status" value={item.status} />
              <InfoRow label="Date" value={item.date} />
              <InfoRow label="Action" value={item.action} />

              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="visibility" size={18} color="#fff" />
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({
  title,
  value,
  icon,
  onToggle,
}: {
  title: string;
  value: string;
  icon: any;
  onToggle: () => void;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <MaterialIcons name={icon} size={20} color="#8B0000" />
        <TouchableOpacity onPress={onToggle}>
          <Ionicons name="eye-outline" size={18} color="#8B0000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={highlight ? styles.amount : styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  container: {
    flex: 1,
  },

  scroll: {
    padding: 15,
  },

  header: {
    backgroundColor: "#fff",
    paddingTop: 38,
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: "32%",
  },

  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },

  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },

  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    marginLeft: 6,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  infoLabel: {
    fontSize: 12,
    color: "#666",
  },

  infoValue: {
    fontSize: 13,
  },

  amount: {
    fontWeight: "bold",
    color: "#0B3F73",
  },

  actionBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3F73",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },
});
