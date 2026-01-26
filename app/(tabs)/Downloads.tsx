import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";

export default function DownloadsScreen() {
  const [duration, setDuration] = useState("ANNUALLY");

  // Example static data (in real app, fetch from API)
  const receipts = [
    { ref: "FH-001", date: "2025-09-01", amount: "1500", balance: "500", applicant: "Victor", link: "View" },
    { ref: "FH-002", date: "2025-08-15", amount: "2000", balance: "0", applicant: "Sarah", link: "View" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Downloadable Receipts</Text>
        </View>

        {/* Filter */}
        <View style={styles.filter}>
          <Text style={styles.label}>Select Receipt Duration:</Text>
          <Picker
  selectedValue={duration}
  style={styles.picker}
  onValueChange={setDuration} // no need for extra arrow fn
>

            <Picker.Item label="Annually" value="ANNUALLY" />
            <Picker.Item label="Three-Quarter" value="THREE-QUARTER" />
            <Picker.Item label="Half-Yearly" value="HALF-YEARLY" />
            <Picker.Item label="Quarterly" value="QUARTERLY" />
            <Picker.Item label="1 Month" value="1-MONTH" />
          </Picker>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.th}>Reference</Text>
            <Text style={styles.th}>Date</Text>
            <Text style={styles.th}>Amount</Text>
            <Text style={styles.th}>Balance</Text>
            <Text style={styles.th}>Applicant</Text>
            <Text style={styles.th}>Link</Text>
          </View>
          {receipts.map((r, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.rowAlt]}>
              <Text style={styles.td}>{r.ref}</Text>
              <Text style={styles.td}>{r.date}</Text>
              <Text style={styles.td}>{r.amount}</Text>
              <Text style={styles.td}>{r.balance}</Text>
              <Text style={styles.td}>{r.applicant}</Text>
              <TouchableOpacity>
                <Text style={styles.link}>{r.link}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Fh260. All rights reserved.</Text>
        {/* <Text style={styles.footerLinks}>Home | Back Page | Sign In</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scroll: { padding: 16, paddingBottom: 80 },

  header: { marginBottom: 15, alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#003366" },

  filter: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontWeight: "600", color: "#003366", marginBottom: 8 },
  picker: { borderColor: "#ddd", borderWidth: 1, borderRadius: 6 },

  table: { backgroundColor: "#fff", borderRadius: 8, overflow: "hidden" },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#003366",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  th: { flex: 1, color: "#fff", fontWeight: "bold", fontSize: 12 },

  tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 5 },
  rowAlt: { backgroundColor: "#f9f9f9" },
  td: { flex: 1, fontSize: 12 },
  link: { color: "#0066cc", fontWeight: "600" },

  footer: {
    padding: 12,
    backgroundColor: "#003366",
    alignItems: "center",
  },
  footerText: { color: "#fff", fontSize: 12 },
  footerLinks: { color: "#ffcc00", marginTop: 5, fontSize: 12, fontWeight: "600" },
});
