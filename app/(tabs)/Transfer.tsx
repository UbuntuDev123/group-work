import { Ionicons } from "@expo/vector-icons";
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

export default function Transfer() {
  const router = useRouter();

  const [showSummary, setShowSummary] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transactionCost, setTransactionCost] = useState("0");

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
          <Text style={styles.headerTitle}>Fund Transfer</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {!showSummary ? (
            <>
              {/* TRANSFER OPTIONS */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Transfer Options</Text>

                <Text style={styles.label}>Transfer Type</Text>
                <TextInput
                  style={styles.input}
                  value="Transfer My Funds"
                  editable={false}
                />
              </View>

              {/* FROM SECTION */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>From Section</Text>

                <Text style={styles.label}>Receipt Number</Text>
                <TextInput style={styles.input} value="93" editable={false} />

                <Text style={styles.label}>Total Amount</Text>
                <TextInput
                  style={styles.input}
                  value="USD 1,400.00"
                  editable={false}
                />

                <Text style={styles.label}>Receipt Amount (Balance)</Text>
                <TextInput
                  style={styles.input}
                  value="USD 1,400.00"
                  editable={false}
                />

                <Text style={styles.label}>Receipt Category</Text>
                <TextInput style={styles.input} value="Fuel" editable={false} />

                <Text style={styles.label}>Transfer Amount</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                />
              </View>

              {/* TO SECTION */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>To Section</Text>

                <Text style={styles.label}>Category</Text>
                <TextInput style={styles.input} value="Transport" />

                <Text style={styles.label}>Transaction Cost (Optional)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={transactionCost}
                  onChangeText={setTransactionCost}
                />
              </View>

              {/* PROCEED */}
              <TouchableOpacity
                style={styles.proceedBtn}
                onPress={() => setShowSummary(true)}
              >
                <Text style={styles.proceedText}>Proceed to Summary</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* SUMMARY */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Fund Transfer Summary</Text>

                <SummaryRow label="Receipt Number" value="93" />
                <SummaryRow label="Total Amount" value="USD 1,400.00" />
                <SummaryRow
                  label="Transfer Amount"
                  value={`USD ${transferAmount || "0.00"}`}
                />
                <SummaryRow
                  label="Transaction Cost"
                  value={`USD ${transactionCost || "0.00"}`}
                />
              </View>

              {/* SUMMARY ACTIONS */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => setShowSummary(false)}
                >
                  <Text style={styles.btnText}>Back to Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn}>
                  <Text style={styles.btnText}>Submit Transfer</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ===== SUMMARY ROW ===== */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
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
    paddingTop: 38, // ≈ 1 cm
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },

  label: { fontSize: 12, color: "#666", marginBottom: 4 },

  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  proceedBtn: {
    backgroundColor: "#0B3F73",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  proceedText: { color: "#fff", fontWeight: "bold" },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: { color: "#666", fontSize: 12 },
  summaryValue: { fontWeight: "bold" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  primaryBtn: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },

  secondaryBtn: {
    backgroundColor: "#0B3F73",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "bold" },
});
