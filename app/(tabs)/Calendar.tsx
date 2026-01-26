import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

type Event = {
  id: string;
  title: string;
  description: string;
  time: string;
  email?: string; // optional
};

export default function SmartPlanner() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");

  const addEvent = async () => {
    if (!title || !description || !time) {
      Alert.alert("Error", "Please fill Title, Description, and Time!");
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      time,
      email: email ? email : undefined, // only add email if filled
    };

    try {
      if (email) {
        // If email is provided, send to backend for reminders
        const response = await fetch("http://localhost:3000/addTask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        });

        const data = await response.json();
        Alert.alert("Success", data.message || "Event added with reminder!");
      } else {
        Alert.alert("Success", "Event added locally!");
      }

      setEvents((prev) => [...prev, newEvent]);
      setTitle("");
      setDescription("");
      setTime("");
      setEmail("");
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Smart Planner</Text>

      <TextInput
        placeholder="Enter title..."
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter description..."
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter time (YYYY-MM-DD HH:mm)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <Button title="Add Event" onPress={addEvent} />

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.time}</Text>
            {item.email && <Text>📧 {item.email}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#e6e7ecff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#786db8ff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  eventItem: {
    backgroundColor: "#ebe9f5ff",
    padding: 12,
    marginTop: 8,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
