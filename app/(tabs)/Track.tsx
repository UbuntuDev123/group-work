import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DisbursedFunds() {
  const [data] = useState<any[]>([]);

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{item.title}</Text>
      <Text style={styles.rowSub}>KES {item.amount}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <FontAwesome5 name="chart-bar" size={18} /> Disbursed Funds
        </Text>
        <Text style={styles.subtitle}>
          Track and manage all disbursed requests
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <FontAwesome5 name="dollar-sign" size={18} color="#0A0F2C" />
          <Text style={styles.statValue}>KES 0</Text>
          <Text style={styles.statLabel}>Total Disbursed</Text>
        </View>

        <View style={styles.statCard}>
          <FontAwesome5 name="check-circle" size={18} color="green" />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* LIST */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Funding Requests</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No disbursed funds yet</Text>
        }
      />

      {/* EXPORT */}
      <TouchableOpacity style={styles.exportBtn}>
        <FontAwesome5 name="file-export" size={14} color="#fff" />
        <Text style={styles.exportText}> Export Report</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A0F2C",
  },

  subtitle: {
    color: "#555",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },

  statLabel: {
    color: "#777",
    fontSize: 13,
  },

  listHeader: {
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  row: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  rowTitle: {
    fontWeight: "600",
  },

  rowSub: {
    color: "#444",
    marginTop: 2,
  },

  status: {
    marginTop: 4,
    color: "green",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },

  exportBtn: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#0A0F2C",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  exportText: {
    color: "#fff",
    fontWeight: "600",
  },
});
