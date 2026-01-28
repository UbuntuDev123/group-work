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

/* ---------- TYPES ---------- */
type Request = {
  id: number;
  title: string;
  amount: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
};

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

  /* ---------- REQUIRED ACTIONS ---------- */
  const [showAction, setShowAction] = useState(false);
  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      title: "Office Supplies",
      amount: "KES 48,000",
      date: "25 Nov 2025",
      status: "Pending",
    },
    {
      id: 2,
      title: "Travel Reimbursement",
      amount: "KES 30,000",
      date: "12 Oct 2025",
      status: "Pending",
    },
  ]);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  /* ---------- FOREX ---------- */
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
    rate && amount ? (parseFloat(amount) * rate).toFixed(2) : "--";

  const updateStatus = (id: number, status: "Approved" | "Rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

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

        <View>
          <Ionicons name="notifications-outline" size={22} color="#0B3F73" />
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>
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

        {/* REQUIRED ACTION */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <Text style={styles.showBalance}>Required Action</Text>
            <TouchableOpacity onPress={() => setShowAction(!showAction)}>
              <Ionicons
                name={showAction ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {showAction &&
            requests.map((req) => (
              <View key={req.id} style={styles.requestItem}>
                <Text style={styles.reqTitle}>{req.title}</Text>
                <Text style={styles.requestSub}>{req.amount}</Text>
                <Text style={styles.requestDate}>{req.date}</Text>

                {req.status === "Pending" ? (
                  <View style={styles.reqActions}>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => updateStatus(req.id, "Rejected")}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => updateStatus(req.id, "Approved")}
                    >
                      <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text
                    style={{
                      marginTop: 10,
                      color: req.status === "Approved" ? "green" : "#8B0000",
                      fontWeight: "bold",
                    }}
                  >
                    {req.status}
                  </Text>
                )}
              </View>
            ))}
        </View>
        {/* ADMIN / TRANSFER / REMINDER */}
        <View style={styles.actionsRow}>
          {[
            { label: "Admin", icon: "admin-panel-settings", route: "/Admin" },
            { label: "Transfer", icon: "swap-horiz", route: "/Transfer" },
            {
              label: "Reminder",
              icon: "notifications-active",
              route: "/Reminder",
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              onPress={() => router.push(item.route as any)}
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
              sub: "Total approved",
            },
            {
              title: "Receipts",
              amount: "1,090.12 KES",
              sub: "Total reconciled",
            },
            {
              title: "Balance",
              amount: "22,360.78 KES",
              sub: "Remaining amount",
            },
          ].map((acc, i) => (
            <View key={i} style={styles.accountCard}>
              <Text style={styles.accountTitle}>{acc.title}</Text>
              <Text style={styles.accountAmount}>{acc.amount}</Text>
              <Text style={styles.accountSub}>{acc.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* FOREX */}
        <View style={styles.forexCard}>
          <Text style={styles.sectionTitle}>Forex Calculator</Text>

          <View style={styles.forexRow}>
            <TouchableOpacity
              style={styles.currencyBox}
              onPress={swapCurrencies}
            >
              <Text style={styles.currencyLabel}>From</Text>
              <Text style={styles.currencyValue}>{from}</Text>
            </TouchableOpacity>

            <Ionicons name="swap-horizontal" size={26} color="#0B3F73" />

            <TouchableOpacity
              style={styles.currencyBox}
              onPress={swapCurrencies}
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

          <Text style={styles.rateText}>
            Exchange Rate: {rate ? rate.toFixed(4) : "--"}
          </Text>

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

  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
  },

  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },

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
  actionIcon: { backgroundColor: "#fff", padding: 12, borderRadius: 30 },
  actionText: { fontSize: 12, marginTop: 5, textAlign: "center" },

  balanceCard: {
    backgroundColor: "#0B3F73",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  balanceRow: { flexDirection: "row", justifyContent: "space-between" },
  showBalance: { color: "#fff", fontWeight: "bold" },

  requestItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  reqTitle: { fontWeight: "bold" },
  requestSub: { fontSize: 12, color: "#666" },
  requestDate: { fontSize: 11, color: "#999" },

  reqActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  approveBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },

  rejectBtn: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "bold" },

  sectionHeader: { marginVertical: 10 },
  sectionTitle: { fontWeight: "bold" },

  redCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0A0F2C", // same dark blue as tab bar
    alignItems: "center",
    justifyContent: "center",

    // subtle elevation like tab icons
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  accountCard: {
    backgroundColor: "#0B3F73",
    padding: 35,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },

  accountTitle: { color: "#fff" },
  accountAmount: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  accountSub: { color: "#fff", fontSize: 12 },

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
  currencyValue: { fontWeight: "bold" },

  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },

  rateText: { marginTop: 10, color: "#0B3F73" },

  resultBox: {
    backgroundColor: "#0B3F73",
    padding: 18,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  resultText: { color: "#fff", fontWeight: "bold" },
});
