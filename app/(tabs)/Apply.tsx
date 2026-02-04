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
type RequestType = "New" | "Reimbursement";

type Item = {
  description: string;
  amount: string;
  quantity: string;
};

type SubCategoryBlock = {
  name: string;
  items: Item[];
};

export default function Apply() {
  const router = useRouter();

  const [requestType, setRequestType] = useState<RequestType>("New");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [transactionCost, setTransactionCost] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategoryBlock[]>([]);

  const categories = ["Office", "Transport", "Training"];
  const subCategoryOptions = ["None", "Stationery", "Fuel", "Accommodation"];

  /* ---------- CALCULATIONS ---------- */
  const getSubCategoryTotal = (items: Item[]) =>
    items.reduce((sum, i) => {
      const a = parseFloat(i.amount) || 0;
      const q = parseFloat(i.quantity) || 0;
      return sum + a * q;
    }, 0);

  const totalAmount = subCategories.reduce(
    (sum, sc) => sum + getSubCategoryTotal(sc.items),
    0,
  );

  const totalRequest = totalAmount + (parseFloat(transactionCost) || 0);

  /* ---------- HANDLERS ---------- */
  const addSubCategory = () => {
    if (!subCategory) return;
    setSubCategories([
      ...subCategories,
      {
        name: subCategory,
        items: [{ description: "", amount: "", quantity: "" }],
      },
    ]);
    setSubCategory("");
  };

  const updateItem = (
    sc: number,
    i: number,
    field: keyof Item,
    value: string,
  ) => {
    const copy = [...subCategories];
    copy[sc].items[i][field] = value;
    setSubCategories(copy);
  };

  const addItem = (sc: number) => {
    const copy = [...subCategories];
    copy[sc].items.push({ description: "", amount: "", quantity: "" });
    setSubCategories(copy);
  };

  const removeItem = (sc: number, i: number) => {
    const copy = [...subCategories];
    copy[sc].items.splice(i, 1);
    setSubCategories(copy);
  };

  const removeSubCategory = (index: number) => {
    const copy = [...subCategories];
    copy.splice(index, 1);
    setSubCategories(copy);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* HEADER – SAME CONCEPT AS DOWNLOADS */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#8B0000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Apply</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* REQUEST TYPE */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Request Type</Text>
            <View style={styles.row}>
              {["New", "Reimbursement"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeBtn,
                    requestType === t && styles.activeType,
                  ]}
                  onPress={() => setRequestType(t as RequestType)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      requestType === t && { color: "#fff" },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ATTACHMENTS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Optional Document Attachments</Text>
            <Text style={styles.note}>
              Upload supporting documents (PDF, Word, Excel). Max 10MB per file.
            </Text>

            <TouchableOpacity style={styles.uploadBtn}>
              <MaterialIcons name="upload-file" size={22} color="#fff" />
              <Text style={styles.uploadText}>Choose Documents</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORY */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category</Text>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Select category" value="" />
              {categories.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>

            <Text style={styles.cardTitle}>Sub-category</Text>
            <Picker selectedValue={subCategory} onValueChange={setSubCategory}>
              <Picker.Item label="Select sub-category" value="" />
              {subCategoryOptions.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>

            <TouchableOpacity style={styles.addSubBtn} onPress={addSubCategory}>
              <Text style={styles.addSubText}>Add sub-category</Text>
            </TouchableOpacity>
          </View>

          {/* SUB-CATEGORIES */}
          {subCategories.map((sc, scIndex) => (
            <View key={scIndex} style={styles.card}>
              <View style={styles.subHeader}>
                <Text style={styles.subTitle}>{sc.name}</Text>
                <TouchableOpacity onPress={() => removeSubCategory(scIndex)}>
                  <Text style={styles.removeBtn}>Remove</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tableHeader}>
                <Text style={styles.th}>Description</Text>
                <Text style={styles.th}>Amount</Text>
                <Text style={styles.th}>Qty</Text>
                <Text style={styles.th}>Action</Text>
              </View>

              {sc.items.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                  <TextInput
                    style={styles.td}
                    placeholder="Description"
                    value={item.description}
                    onChangeText={(v) =>
                      updateItem(scIndex, i, "description", v)
                    }
                  />
                  <TextInput
                    style={styles.td}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={item.amount}
                    onChangeText={(v) => updateItem(scIndex, i, "amount", v)}
                  />
                  <TextInput
                    style={styles.td}
                    placeholder="Qty"
                    keyboardType="numeric"
                    value={item.quantity}
                    onChangeText={(v) => updateItem(scIndex, i, "quantity", v)}
                  />
                  <TouchableOpacity onPress={() => removeItem(scIndex, i)}>
                    <Text style={styles.removeBtn}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity onPress={() => addItem(scIndex)}>
                <Text style={styles.addItem}>Add Item</Text>
              </TouchableOpacity>

              <Text style={styles.subTotal}>
                Sub-category Total:{" "}
                {getSubCategoryTotal(sc.items).toLocaleString()}
              </Text>
            </View>
          ))}

          {/* TRANSACTION COST */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Transaction Cost (Optional)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter transaction cost"
              value={transactionCost}
              onChangeText={setTransactionCost}
            />
          </View>

          {/* TOTALS */}
          <View style={styles.card}>
            <View style={styles.totalRow}>
              <Text>Total Amount</Text>
              <Text style={styles.bold}>{totalAmount.toLocaleString()}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Transaction Cost</Text>
              <Text style={styles.bold}>
                {(parseFloat(transactionCost) || 0).toLocaleString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.grand}>Total Request</Text>
              <Text style={styles.grandAmount}>
                {totalRequest.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* PROCEED BUTTON – SAME COLOR AS REQUEST TAB */}
          <TouchableOpacity style={styles.proceedBtn}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
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
  },
  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: { fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  activeType: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  typeText: { fontWeight: "600" },

  uploadBtn: {
    backgroundColor: "#0B3F73",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  uploadText: { color: "#fff", fontWeight: "bold" },
  note: { color: "#666", marginBottom: 10 },

  addSubBtn: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addSubText: { textAlign: "center", fontWeight: "bold" },

  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subTitle: { fontWeight: "bold" },
  removeBtn: { color: "red", fontWeight: "bold" },

  tableHeader: { flexDirection: "row" },
  th: { flex: 1, fontWeight: "bold" },
  tableRow: { flexDirection: "row", gap: 6, marginVertical: 6 },
  td: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 6 },

  addItem: {
    textAlign: "center",
    marginTop: 10,
    color: "#0B3F73",
    fontWeight: "bold",
  },

  subTotal: {
    marginTop: 8,
    textAlign: "right",
    fontWeight: "bold",
    color: "#0B3F73",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  bold: { fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  grand: { fontWeight: "bold", fontSize: 16 },
  grandAmount: { fontWeight: "bold", fontSize: 18, color: "green" },

  proceedBtn: {
    backgroundColor: "#0B3F73", // SAME AS REQUEST TAB
    padding: 16,
    borderRadius: 10,
    marginBottom: 30,
  },
  proceedText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
