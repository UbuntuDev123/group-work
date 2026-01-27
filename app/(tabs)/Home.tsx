import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      .then((res) => res.json())
      .then((data) => setRate(data?.rates?.[to]))
      .catch(() => setRate(null));
  }, [from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const convertedAmount =
    rate && amount ? (parseFloat(amount) * rate).toFixed(2) : "-";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ height: 38 }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>KI</Text>
        </View>
        <Text style={styles.homeText}>Home</Text>
        <Ionicons name="notifications-outline" size={22} color="#0B3F73" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
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
              activeOpacity={0.7}
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
          <View style={styles.balanceRow}>
            <Text style={styles.showBalance}>Required Action</Text>
            <Ionicons name="eye-outline" size={18} color="#8B0000" />
          </View>
        </View>

        {/* ADMIN / TRANSFER / REMINDER */}
        <View style={styles.actionsRow}>
          {[
            { label: "Admin", icon: "admin-panel-settings", tab: "/Admin" },
            { label: "Transfer", icon: "swap-horiz", tab: "/Transfer" },
            {
              label: "Reminder",
              icon: "notifications-active",
              tab: "/Reminder",
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={() => router.push(item.tab as any)}
            >
              <View style={styles.redCircle}>
                <MaterialIcons name={item.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ACCOUNTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My accounts</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            {
              title: "Expenditure",
              amount: "23,450.90 KES",
              sub: "Total amount approved",
            },
            {
              title: "Receipts",
              amount: "1,090.12 KES",
              sub: "Total amount reconciled",
            },
            {
              title: "Balance",
              amount: "22,360.78 KES",
              sub: "Total remaining amount",
              negative: true,
            },
          ].map((acc, i) => (
            <View key={i} style={styles.accountCard}>
              <Text style={styles.accountTitle}>{acc.title}</Text>
              <Text
                style={
                  acc.negative
                    ? styles.accountAmountNegative
                    : styles.accountAmount
                }
              >
                {acc.amount}
              </Text>
              <Text style={styles.accountSub}>{acc.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* FOREX */}
        <View style={styles.forexCard}>
          <Text style={styles.sectionTitle}>Forex Calculator</Text>

          <View style={styles.forexRow}>
            <View style={styles.currencyBox}>
              <Text style={styles.currencyLabel}>From</Text>
              <Text style={styles.currencyValue}>{from}</Text>
            </View>

            <TouchableOpacity onPress={swapCurrencies}>
              <Ionicons name="swap-horizontal" size={26} color="#0B3F73" />
            </TouchableOpacity>

            <View style={styles.currencyBox}>
              <Text style={styles.currencyLabel}>To</Text>
              <Text style={styles.currencyValue}>{to}</Text>
            </View>
          </View>

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
          />

          <View style={styles.rateBox}>
            <Text style={{ color: "green" }}>
              Buy Rate: {rate ? rate.toFixed(4) : "--"} {to}
            </Text>
            <Text style={{ color: "red" }}>
              Sell Rate: {rate ? (rate * 0.99).toFixed(4) : "--"} {to}
            </Text>
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Converted Amount: {convertedAmount}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  scroll: { padding: 15 },
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
  profileText: { color: "#0B3F73", fontWeight: "bold" },
  homeText: { fontWeight: "bold" },
  greeting: { fontSize: 18, marginVertical: 10 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  actionItem: { alignItems: "center", width: 70 },
  actionIcon: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
  },
  actionText: { textAlign: "center", fontSize: 12, marginTop: 5 },
  balanceCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  balanceRow: { flexDirection: "row", justifyContent: "space-between" },
  showBalance: { color: "#8B0000", fontWeight: "bold" },
  redCircle: {
    backgroundColor: "#0B3F73",
    padding: 14,
    borderRadius: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  sectionTitle: { fontWeight: "bold" },
  accountCard: {
    backgroundColor: "#8B0000",
    padding: 35,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },
  accountTitle: { color: "#fff" },
  accountAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  accountAmountNegative: {
    color: "#ffdede",
    fontSize: 18,
    fontWeight: "bold",
  },
  accountSub: { color: "#f0dede", fontSize: 12 },
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
    borderRadius: 8,
    padding: 10,
    width: 120,
  },
  currencyLabel: { fontSize: 12, color: "#666" },
  currencyValue: { fontSize: 14, fontWeight: "bold" },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  rateBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "#0B3F73",
    padding: 18,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
