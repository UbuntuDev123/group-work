import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const currencies = ["USD", "KES", "EUR", "GBP", "NGN", "ZAR", "JPY", "CAD"];

export default function Home() {
  const router = useRouter();

  /* ---------- GREETING ---------- */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  /* ---------- FOREX STATE ---------- */
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [pickerType, setPickerType] = useState<"from" | "to" | null>(null);

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      .then((res) => res.json())
      .then((data) => setRate(data?.rates?.[to]))
      .catch(() => setRate(null));
  }, [from, to]);

  const convertedAmount =
    rate && amount ? (parseFloat(amount) * rate).toFixed(2) : "-";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1 CM TOP SPACE */}
      <View style={{ height: 38 }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>KI</Text>
        </View>
        <Text style={styles.homeText}>Home</Text>
        <Ionicons name="notifications-outline" size={22} color="#0B3F73" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* GREETING */}
        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={{ fontWeight: "bold" }}>Kelvine</Text>
        </Text>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          {[
            { label: "Track", icon: "account-balance", route: "/Track" },
            { label: "Apply", icon: "assignment", route: "/Apply" },
            { label: "Receipts", icon: "receipt", route: "/Receipts" },
            { label: "Downloads", icon: "download", route: "/Downloads" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons
                  name={item.icon as any}
                  size={22}
                  color="#8B0000"
                />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BALANCE */}
        <View style={styles.balanceCard}>
          <Text style={styles.showBalance}>Required Action</Text>
        </View>

        {/* ACCOUNTS */}
        <Text style={styles.sectionTitle}>My Accounts</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { title: "Expenditure", amount: "23,450.90 KES" },
            { title: "Receipts", amount: "1,090.12 KES" },
            { title: "Balance", amount: "22,360.78 KES" },
          ].map((acc, i) => (
            <View key={i} style={styles.accountCard}>
              <Text style={styles.accountTitle}>{acc.title}</Text>
              <Text style={styles.accountAmount}>{acc.amount}</Text>
            </View>
          ))}
        </ScrollView>

        {/* FOREX CALCULATOR */}
        <View style={styles.forexCard}>
          <Text style={styles.sectionTitle}>Forex Calculator</Text>

          <View style={styles.forexRow}>
            <TouchableOpacity
              style={styles.currencyBox}
              onPress={() => setPickerType("from")}
            >
              <Text style={styles.currencyLabel}>From</Text>
              <Text style={styles.currencyValue}>{from}</Text>
            </TouchableOpacity>

            <Ionicons name="swap-horizontal" size={26} color="#0B3F73" />

            <TouchableOpacity
              style={styles.currencyBox}
              onPress={() => setPickerType("to")}
            >
              <Text style={styles.currencyLabel}>To</Text>
              <Text style={styles.currencyValue}>{to}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
          />

          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Converted Amount: {convertedAmount}
            </Text>
          </View>
        </View>

        {/* 1 CM FOOTER SPACE */}
        <View style={{ height: 38 }} />
      </ScrollView>

      {/* CURRENCY PICKER MODAL */}
      <Modal visible={pickerType !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currencies.map((cur) => (
              <TouchableOpacity
                key={cur}
                style={styles.modalItem}
                onPress={() => {
                  pickerType === "from" ? setFrom(cur) : setTo(cur);
                  setPickerType(null);
                }}
              >
                <Text>{cur}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#0B3F73",
    alignItems: "center",
    justifyContent: "center",
  },

  showBalance: {
    color: "#8B1D18",
    fontSize: 14,
    fontWeight: "500",
  },
  profileText: { color: "#0B3F73", fontWeight: "bold" },
  homeText: { fontWeight: "bold" },

  greeting: { fontSize: 18, marginVertical: 10 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  balanceRow: { flexDirection: "row", justifyContent: "space-between" },
  showBalance: { color: "#8B0000", fontWeight: "bold" },
  actionItem: { alignItems: "center", width: 70 },
  actionIcon: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
  },
  actionText: { fontSize: 12, marginTop: 5 },

  balanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  sectionTitle: { fontWeight: "bold", marginVertical: 10 },

  accountCard: {
    backgroundColor: "#0B3F73",
    padding: 25,
    borderRadius: 10,
    marginRight: 10,
    width: 220,
  },
  accountTitle: { color: "#fff" },
  accountAmount: { color: "#fff", fontWeight: "bold" },

  forexCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  forexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  currencyBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    width: 120,
  },

  currencyLabel: { fontSize: 12, color: "#666" },
  currencyValue: { fontWeight: "bold" },

  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },

  resultBox: {
    backgroundColor: "#0B3F73",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  resultText: { color: "#fff", fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
