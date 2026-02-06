import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= BACKEND ================= */
const BASE_URL = "https://fhserver.org.fh260.org";

/* ================= TYPES ================= */
type Approval = {
  Id: number;
  REQUEST_TYPE: string;
  requester_name: string;
  Total_Request: number;
  currency_code: string;
  submission_time: string;
};

type Accounts = {
  expenditureAmount: number;
  receiptsAmount: number;
  balanceAmount: number;
  currency_code: string;
};

export default function Home() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Accounts>({
    expenditureAmount: 0,
    receiptsAmount: 0,
    balanceAmount: 0,
    currency_code: "KES",
  });

  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* ================= APPROVAL STATES ================= */
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [showAction, setShowAction] = useState(false);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    checkAuth();
    loadProfile();
    loadAccounts();
    loadTheme();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) router.replace("/Signin");
  };

  const loadTheme = async () => {
    const theme = await AsyncStorage.getItem("theme");
    setDarkMode(theme === "dark");
  };

  /* ================= PROFILE ================= */
  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUserName(data.name || "User");
      setProfileImage(data.profilePhoto || null);
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/Signin");
  };

  /* ================= DARK MODE ================= */
  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
  };

  /* ================= ACCOUNTS ================= */
  const loadAccounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.log("Accounts error:", err);
    }
  };

  /* ================= APPROVAL FETCH ================= */
  const fetchApprovals = async () => {
    try {
      setLoadingApprovals(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/approvals/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setApprovals(data);
    } catch (err) {
      console.log("Approvals error:", err);
    } finally {
      setLoadingApprovals(false);
    }
  };

  /* ================= FOREX ================= */
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      .then((r) => r.json())
      .then((d) => setRate(d?.rates?.[to]));
  }, [from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const converted =
    rate && amount ? (parseFloat(amount) * rate).toFixed(2) : "--";

  /* ================= GREETING ================= */
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  };

  /* ================= UI ================= */
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0A0F2C" : "#f2f2f2" },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ height: 38 }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => setShowProfileMenu(!showProfileMenu)}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImg} />
          ) : (
            <Text style={styles.profileText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.homeText}>Home</Text>
        <Ionicons name="notifications-outline" size={22} color="#0B3F73" />
      </View>

      {showProfileMenu && (
        <View style={styles.profileMenu}>
          <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
            <Text>Dark Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} style={styles.menuItem}>
            <Text style={{ color: "red" }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>
          {getGreeting()},{" "}
          <Text style={{ fontWeight: "bold" }}>{userName}</Text>
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

        {/* MAROON BUTTONS */}
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

        {/* REQUIRED ACTION */}
        <View style={styles.requiredCard}>
          <View style={styles.balanceRow}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Required Action
            </Text>

            <TouchableOpacity
              onPress={() => {
                const next = !showAction;
                setShowAction(next);
                if (next) fetchApprovals();
              }}
            >
              <Ionicons
                name={showAction ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {showAction && (
            <>
              <Text style={{ color: "#fff", marginBottom: 10 }}>
                Approver: {userName}
              </Text>

              {loadingApprovals ? (
                <ActivityIndicator color="#fff" />
              ) : approvals.length === 0 ? (
                <Text style={{ color: "#fff" }}>All approvals complete</Text>
              ) : (
                approvals.map((r) => (
                  <View key={r.Id} style={styles.requestItem}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {r.REQUEST_TYPE} - {r.requester_name}
                    </Text>

                    <Text style={{ color: "#fff" }}>
                      {r.currency_code} {r.Total_Request}
                    </Text>

                    <Text style={{ color: "#ccc" }}>
                      {new Date(r.submission_time).toLocaleDateString()}
                    </Text>

                    <View style={styles.reqActions}>
                      <TouchableOpacity style={styles.rejectBtn}>
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.approveBtn}>
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </View>

        {/* ACCOUNTS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { title: "Expenditure", value: accounts.expenditureAmount },
            { title: "Receipts", value: accounts.receiptsAmount },
            { title: "Balance", value: accounts.balanceAmount },
          ].map((a, i) => (
            <View key={i} style={styles.accountCard}>
              <Text style={styles.accountTitle}>{a.title}</Text>
              <Text style={styles.accountAmount}>
                {a.value} {accounts.currency_code}
              </Text>
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
              <Text>{from}</Text>
            </TouchableOpacity>

            <Ionicons name="swap-horizontal" size={26} color="#0B3F73" />

            <TouchableOpacity
              style={styles.currencyBox}
              onPress={swapCurrencies}
            >
              <Text>{to}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
          />

          <Text>Rate: {rate ?? "--"}</Text>
          <Text>Converted: {converted}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 15 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#0B3F73",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  profileImg: { width: 36, height: 36, borderRadius: 18 },
  profileText: { color: "#0B3F73", fontWeight: "bold" },
  homeText: { fontWeight: "bold" },

  profileMenu: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },

  menuItem: { padding: 10 },

  greeting: { fontSize: 18, marginVertical: 10 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  actionItem: { alignItems: "center", width: 70 },
  actionIcon: { backgroundColor: "#fff", padding: 12, borderRadius: 30 },
  actionText: { fontSize: 12, marginTop: 5 },

  redCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0A0F2C",
    alignItems: "center",
    justifyContent: "center",
  },

  requiredCard: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  requestItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#6E0000",
    borderRadius: 8,
  },

  reqActions: {
    flexDirection: "row",
    marginTop: 10,
  },

  approveBtn: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },

  btnText: { color: "#fff", fontWeight: "bold" },

  accountCard: {
    backgroundColor: "#0B3F73",
    padding: 35,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },

  accountTitle: { color: "#fff" },
  accountAmount: { color: "#fff", fontSize: 18, fontWeight: "bold" },

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

  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
});
