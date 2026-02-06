import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- BACKEND URL ---------- */
const API_URL = "https://fhserver.org.fh260.org";

/* ---------- TYPES MATCH BACKEND ---------- */
type Currency = {
  code: string;
  symbol: string;
};

type Item = {
  description: string;
  amount: number;
  quantity: number;
  subCategory: string;
};

type Fund = {
  id: string;
  description: string;
  requestedBy: string;
  category: string;
  requestType: string;
  status: string;
  dateApproved: string;
  totalRequest: number;
  currency: Currency;
  items: Item[];
};

/* ---------- SCREEN ---------- */
export default function DisbursedFunds() {
  const router = useRouter();

  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  /* ---------- FETCH CATEGORIES ---------- */
  const loadCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/disbursed-funds/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed loading categories");

      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.log("Category load error", e);
    }
  };

  /* ---------- FETCH FUNDS (LIKE WEB VERSION) ---------- */
  const loadFunds = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        router.replace("/");
        return;
      }

      const params = new URLSearchParams({
        search,
        status,
        category,
      });

      const res = await fetch(
        `${API_URL}/api/disbursed-funds?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed fetching funds");

      const data = await res.json();

      setFunds(data.funds); // ✅ backend returns { funds, statistics }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadFunds();
  }, [search, status, category]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#8B0000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Disbursed Funds</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#666" />
            <TextInput
              placeholder="Search requests..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* STATUS FILTER */}
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={status} onValueChange={setStatus}>
              <Picker.Item label="All Status" value="all" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Uploaded" value="uploaded" />
              <Picker.Item label="Uncleared" value="uncleared" />
              <Picker.Item label="Cleared" value="cleared" />
            </Picker>
          </View>

          {/* CATEGORY FILTER */}
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="All Categories" value="all" />
              {categories.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/* FUNDS LIST */}
          {funds.map((fund) => (
            <View key={fund.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                #{fund.id} — {fund.description}
              </Text>

              <InfoRow label="Requested By" value={fund.requestedBy} />
              <InfoRow label="Category" value={fund.category} />
              <InfoRow label="Type" value={fund.requestType} />
              <InfoRow label="Status" value={fund.status} />
              <InfoRow
                label="Total"
                value={`${fund.currency.symbol} ${fund.totalRequest.toLocaleString()}`}
                highlight
              />
              <InfoRow
                label="Approved"
                value={new Date(fund.dateApproved).toLocaleDateString()}
              />

              {/* ITEMS */}
              {fund.items.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={styles.itemText}>
                    • {item.description} ({item.subCategory})
                  </Text>
                  <Text style={styles.itemAmount}>
                    {fund.currency.symbol} {item.amount} × {item.quantity}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {funds.length === 0 && (
            <Text style={styles.empty}>No matching records found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- SMALL COMPONENT ---------- */
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
    gap: 10,
  },

  headerTitle: { fontSize: 16, fontWeight: "bold" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  searchInput: { flex: 1, marginLeft: 6 },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: { fontWeight: "bold", marginBottom: 8 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  infoLabel: { fontSize: 12, color: "#666" },
  infoValue: { fontSize: 13 },
  amount: { fontWeight: "bold", color: "#0B3F73" },

  itemRow: { marginTop: 4 },
  itemText: { fontSize: 12 },
  itemAmount: { fontSize: 12, color: "#444" },

  empty: { textAlign: "center", color: "#666", marginTop: 30 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
