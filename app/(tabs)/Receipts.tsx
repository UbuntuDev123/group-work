import * as DocumentPicker from "expo-document-picker";
import { Stack } from "expo-router";
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

const API_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGUVHqadLXkMMMYTqveJozm3pUww5PLoYXvs0Dcm8U3AuZOsqqCqmCmVXkeSeZ82FQ7ARHPhLW-dWo/pub?gi";

export default function ReceiptsScreen() {
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const textData = await response.text();
      const rows = textData
        .split("\n")
        .slice(1)
        .map((row) => row.split(","));
      const data = rows.map((row) => ({
        Date: row[0]?.trim(),
        Name: row[1]?.trim(),
        TotalAmount: row[2]?.trim(),
        Reference: row[3]?.trim(),
      }));

      // Extract unique names
      const uniqueNames = [...new Set(data.map((item) => item.Name))].filter(
        (n) => n,
      );

      setNames(uniqueNames);
      setRecords(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch receipts data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.canceled) return;
    Alert.alert("Uploaded", `File: ${res.assets[0].name}`);
  };

  const handleSubmit = (id: number, receiptValue: string) => {
    if (
      !receiptValue ||
      isNaN(Number(receiptValue)) ||
      Number(receiptValue) <= 0
    ) {
      Alert.alert("Error", "Please enter a valid receipt amount.");
      return;
    }
    Alert.alert(
      "Success",
      `Transaction ${id} cleared with receipt: ${receiptValue}`,
    );
  };

  const filteredRecords = records.filter((r) => r.Name === selectedName);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt Portal</Text>
      <Text style={styles.subtitle}>
        Select your name and view your balances and transactions.
      </Text>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Dropdown */}
      <ScrollView horizontal style={styles.dropdown}>
        {names.map((name, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.nameButton,
              selectedName === name && styles.nameButtonSelected,
            ]}
            onPress={() => setSelectedName(name)}
          >
            <Text
              style={[
                styles.nameButtonText,
                selectedName === name && styles.nameButtonTextSelected,
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions */}
      <ScrollView style={{ marginTop: 15 }}>
        {filteredRecords.map((row, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.cardTitle}>{row.Name}</Text>
            <Text>Date: {row.Date}</Text>
            <Text>Total Amount: {row.TotalAmount}</Text>
            <Text>Reference: {row.Reference}</Text>

            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => Alert.alert("Clear clicked")}
            >
              <Text style={{ color: "white" }}>Clear</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Enter receipt amount"
              style={styles.input}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={handleFileUpload}
            >
              <Text style={{ color: "white" }}>Upload File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => handleSubmit(idx, "1000")}
            >
              <Text style={{ color: "black" }}>Submit to Clear</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f9" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007bff",
  },
  subtitle: { textAlign: "center", marginVertical: 10 },
  dropdown: { marginVertical: 10 },
  nameButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  nameButtonSelected: { backgroundColor: "#007bff" },
  nameButtonText: { color: "#333" },
  nameButtonTextSelected: { color: "white", fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  clearBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
