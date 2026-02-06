import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
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

/* ---------- CONFIG ---------- */
const BASE_URL = "https://fhserver.org.fh260.org";

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
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ["Office", "Transport", "Training"];
  const subCategoryOptions = ["Stationery", "Fuel", "Accommodation"];

  /* ---------- DOCUMENT PICKER ---------- */
  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: "*/*",
      });

      if (!result.canceled) {
        setDocuments([...documents, ...result.assets]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

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

  /* ---------- SUBMIT REQUEST ---------- */
  const submitRequest = async () => {
    if (!category || subCategories.length === 0) {
      Alert.alert("Error", "Please complete the form");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Session expired", "Please login again.");
        return;
      }

      const multipartFormData = new FormData();

      const requestData = {
        requestType,
        category,
        subCategories,
        moneyAtHand: 0,
        transactionCost: parseFloat(transactionCost) || 0,
        attachments: [],
      };

      multipartFormData.append("requestData", JSON.stringify(requestData));

      documents.forEach((doc, index) => {
        multipartFormData.append(`document_${index}`, {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType || "application/octet-stream",
        } as any);
      });

      const response = await fetch(`${BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: multipartFormData,
      });

      const text = await response.text();
      console.log("SERVER RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid response");
      }

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      Alert.alert("Success", "Request submitted successfully");
      router.back();
    } catch (error: any) {
      Alert.alert("Submission Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
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
                    style={{
                      color: requestType === t ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ATTACHMENTS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Attachments</Text>

            <TouchableOpacity style={styles.uploadBtn} onPress={pickDocuments}>
              <MaterialIcons name="upload-file" size={22} color="#fff" />
              <Text style={styles.uploadText}>Choose Documents</Text>
            </TouchableOpacity>

            {documents.map((d, i) => (
              <Text key={i} style={{ marginTop: 5 }}>
                {d.name}
              </Text>
            ))}
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
              <Text style={{ fontWeight: "bold" }}>{sc.name}</Text>

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
                    <Text style={{ color: "red" }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity onPress={() => addItem(scIndex)}>
                <Text style={{ color: "#0B3F73", fontWeight: "bold" }}>
                  Add Item
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* TRANSACTION COST */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Transaction Cost</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={transactionCost}
              onChangeText={setTransactionCost}
            />
          </View>

          {/* TOTAL */}
          <View style={styles.card}>
            <Text>Total Request: {totalRequest.toLocaleString()}</Text>
          </View>

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={submitRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.proceedText}>Submit Request</Text>
            )}
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
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

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

  uploadBtn: {
    backgroundColor: "#0B3F73",
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  uploadText: { color: "#fff", fontWeight: "bold" },

  addSubBtn: {
    backgroundColor: "#FFC107",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  addSubText: { textAlign: "center", fontWeight: "bold" },

  tableRow: { flexDirection: "row", gap: 6, marginVertical: 6 },

  td: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 6 },

  input: { borderWidth: 1, borderRadius: 8, padding: 12 },

  proceedBtn: {
    backgroundColor: "#0B3F73",
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
