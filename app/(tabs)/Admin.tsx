import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AdminScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requests, setRequests] = useState([
    {
      name: "John Doe",
      requestType: "Financial Aid",
      category: "Education",
      subCategory: "Tuition",
      description: "Tuition fees for secondary school",
      amount: 500,
      quantity: 1,
      transactionCost: 20,
      date: "2025-04-09",
    },
    {
      name: "Mary Wanjiku",
      requestType: "Medical Support",
      category: "Health",
      subCategory: "Medication",
      description: "Monthly diabetes medication",
      amount: 75,
      quantity: 2,
      transactionCost: 0,
      date: "2025-04-08",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (username === "test" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      setMessage("Invalid username or password.");
    }
  };

  const handleAction = (index: number, action: string) => {
    setMessage("⏳ Processing...");
    setTimeout(() => {
      const updated = [...requests];
      updated.splice(index, 1);
      setRequests(updated);
      setSelectedRequest(null);
      setMessage(`✅ Task ${action}`);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* HEADER with top-right Admin button */}
      <View style={styles.header}>
        <Text style={styles.headerText}>KCAU</Text>
        <TouchableOpacity style={styles.adminButton}>
          <FontAwesome5 name="user-shield" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {!isLoggedIn ? (
        <View style={styles.loginBox}>
          <Text style={styles.title}>Admin Login</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {message ? <Text style={{ color: "red" }}>{message}</Text> : null}
        </View>
      ) : (
        <ScrollView style={styles.dashboard}>
          <Text style={styles.title}>Incoming Requests</Text>

          {requests.map((req, index) => {
            const totalAmount = req.amount * req.quantity + req.transactionCost;
            return (
              <View key={index} style={styles.card}>
                <Text style={styles.name}>{req.name}</Text>
                <Text>Date: {req.date}</Text>
                <Text>Total: ${totalAmount}</Text>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => setSelectedRequest({ ...req, index })}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>Clear</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {selectedRequest && (
            <View style={styles.detailBox}>
              <Text>Name: {selectedRequest.name}</Text>
              <Text>Request Type: {selectedRequest.requestType}</Text>
              <Text>Category: {selectedRequest.category}</Text>
              <Text>Sub Category: {selectedRequest.subCategory}</Text>
              <Text>Description: {selectedRequest.description}</Text>
              <Text>Total: {selectedRequest.amount * selectedRequest.quantity + selectedRequest.transactionCost}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "green" }]}
                  onPress={() => handleAction(selectedRequest.index, "Approved")}
                >
                  <Text style={{ color: "#fff" }}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: "red" }]}
                  onPress={() => handleAction(selectedRequest.index, "Rejected")}
                >
                  <Text style={{ color: "#fff" }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {message ? <Text style={{ textAlign: "center", color: "green" }}>{message}</Text> : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    backgroundColor: "#003366",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  adminButton: {
    padding: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  loginBox: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  dashboard: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  name: { fontWeight: "bold", color: "#007bff", fontSize: 16 },
  clearBtn: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  detailBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionBtn: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5 },
});
