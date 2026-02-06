import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
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

const API_BASE_URL = "https://fhserver.org.fh260.org/api";

export default function Transfer() {
  /* -------------------- STATE -------------------- */
  const [loading, setLoading] = useState(false);

  const [transferType, setTransferType] = useState<"self" | "colleague">(
    "self",
  );
  const [colleagues, setColleagues] = useState<any[]>([]);
  const [selectedColleague, setSelectedColleague] = useState<any>(null);

  const [receipts, setReceipts] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const [transferAmount, setTransferAmount] = useState("");
  const [outstandingAmount, setOutstandingAmount] = useState(0);

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [itemDescription, setItemDescription] = useState("");
  const [itemAmount, setItemAmount] = useState("");

  const [addedItems, setAddedItems] = useState<any[]>([]);
  const [transactionCost, setTransactionCost] = useState("0");

  const [showSummary, setShowSummary] = useState(false);

  const currencySymbol = selectedReceipt?.currency_code === "KES" ? "KSh" : "$";

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    loadColleagues();
    loadReceipts();
  }, []);

  async function getToken() {
    return await AsyncStorage.getItem("token");
  }

  async function loadColleagues() {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/transfer_colleagues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setColleagues(data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadReceipts(colleagueId?: number) {
    setLoading(true);
    try {
      const token = await getToken();
      let url = `${API_BASE_URL}/funds-transfer/receipts`;
      if (colleagueId) url += `?colleagueId=${colleagueId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReceipts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- LOGIC -------------------- */
  function onSelectReceipt(receipt: any) {
    setSelectedReceipt(receipt);
    setTransferAmount("");
    setOutstandingAmount(receipt.balance_amount);
    setAddedItems([]);
  }

  function calculateOutstanding(value: string) {
    const amount = parseFloat(value) || 0;
    if (!selectedReceipt) return;

    if (amount > selectedReceipt.balance_amount) {
      Alert.alert("Error", "Transfer amount exceeds receipt balance");
      return;
    }

    setTransferAmount(value);
    setOutstandingAmount(selectedReceipt.balance_amount - amount);
  }

  function addItem() {
    const amount = parseFloat(itemAmount);
    if (!subcategory || !itemDescription || isNaN(amount)) {
      Alert.alert("Error", "Fill all item fields");
      return;
    }

    const totalItems = addedItems.reduce((t, i) => t + i.amount, 0);
    if (totalItems + amount > Number(transferAmount)) {
      Alert.alert("Error", "Items exceed transfer amount");
      return;
    }

    setAddedItems([
      ...addedItems,
      { subcategory, description: itemDescription, amount },
    ]);
    setItemDescription("");
    setItemAmount("");
  }

  async function submitTransfer() {
    try {
      setLoading(true);
      const token = await getToken();

      const payload = {
        receiptNumber: selectedReceipt.receipt_reference,
        receiptAmount: selectedReceipt.balance_amount,
        totalAmount: Number(transferAmount),
        outstandingAmount,
        receiptCategory: selectedReceipt.category,
        category,
        transactionCost: Number(transactionCost),
        totalTransferAmount:
          addedItems.reduce((t, i) => t + i.amount, 0) +
          Number(transactionCost),
        subcategories: addedItems,
        colleagueId: selectedColleague?.Id || null,
        currencyCode: selectedReceipt.currency_code,
      };

      const res = await fetch(`${API_BASE_URL}/funds-transfer/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Transfer submitted for approval");
        resetForm();
      } else {
        Alert.alert("Error", data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedReceipt(null);
    setTransferAmount("");
    setOutstandingAmount(0);
    setCategory("");
    setSubcategory("");
    setAddedItems([]);
    setShowSummary(false);
  }

  /* -------------------- UI -------------------- */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fund Transfer</Text>

      {/* Transfer Type */}
      <Card title="Transfer Options">
        <Picker
          selectedValue={transferType}
          onValueChange={(v) => {
            setTransferType(v);
            setSelectedColleague(null);
            loadReceipts();
          }}
        >
          <Picker.Item label="Transfer My Funds" value="self" />
          <Picker.Item label="Transfer Colleague's Funds" value="colleague" />
        </Picker>

        {transferType === "colleague" && (
          <Picker
            selectedValue={selectedColleague?.Id}
            onValueChange={(id) => {
              const col = colleagues.find((c) => c.Id === id);
              setSelectedColleague(col);
              loadReceipts(col.Id);
            }}
          >
            <Picker.Item label="Select colleague" value="" />
            {colleagues.map((c) => (
              <Picker.Item key={c.Id} label={c.name} value={c.Id} />
            ))}
          </Picker>
        )}
      </Card>

      {/* From Section */}
      <Card title="From">
        <Picker
          selectedValue={selectedReceipt?.receipt_reference}
          onValueChange={(ref) => {
            const r = receipts.find((x) => x.receipt_reference === ref);
            if (r) onSelectReceipt(r);
          }}
        >
          <Picker.Item label="Select receipt" value="" />
          {receipts.map((r) => (
            <Picker.Item
              key={r.receipt_reference}
              label={r.receipt_reference}
              value={r.receipt_reference}
            />
          ))}
        </Picker>

        {selectedReceipt && (
          <>
            <Info
              label="Total Amount"
              value={`${currencySymbol}${selectedReceipt.total_amount}`}
            />
            <Info
              label="Balance"
              value={`${currencySymbol}${selectedReceipt.balance_amount}`}
            />
            <Info label="Category" value={selectedReceipt.category} />

            <TextInput
              style={styles.input}
              placeholder="Transfer Amount"
              keyboardType="numeric"
              value={transferAmount}
              onChangeText={calculateOutstanding}
            />

            <Info
              label="Outstanding"
              value={`${currencySymbol}${outstandingAmount}`}
            />
          </>
        )}
      </Card>

      {/* To Section */}
      <Card title="To">
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Subcategory"
          value={subcategory}
          onChangeText={setSubcategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Item Description"
          value={itemDescription}
          onChangeText={setItemDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Item Amount"
          keyboardType="numeric"
          value={itemAmount}
          onChangeText={setItemAmount}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Item</Text>
        </TouchableOpacity>
      </Card>

      {/* Items */}
      {addedItems.map((item, i) => (
        <View key={i} style={styles.itemCard}>
          <Text>{item.subcategory}</Text>
          <Text>{item.description}</Text>
          <Text>
            {currencySymbol}
            {item.amount}
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={submitTransfer}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Transfer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* -------------------- COMPONENTS -------------------- */
function Card({ title, children }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Info({ label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f7fb" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  infoLabel: { color: "#666" },
  infoValue: { fontWeight: "600" },

  addBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  addBtnText: { color: "#fff", marginLeft: 6 },

  itemCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  submitBtn: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },

  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
