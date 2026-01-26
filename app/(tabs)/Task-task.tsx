// app/screens/TaskForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [reminder, setReminder] = useState("");

  const handleSubmit = () => {
    if (!title || !description || !dueDate || !reminder) {
      Alert.alert("❌ Error", "Please fill in all fields");
      return;
    }

    // Here you can connect to EmailJS or backend
    Alert.alert("✅ Success", `Task "${title}" added successfully!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>➕ Add a New Task</Text>

        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="What is this task about?"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Due Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dueDate}
          onChangeText={setDueDate}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={priority}
            onValueChange={(value) => setPriority(value)}
          >
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>

        <Text style={styles.label}>Reminder</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={reminder}
            onValueChange={(value) => setReminder(value)}
          >
            <Picker.Item label="Select Reminder" value="" />
            <Picker.Item label="30 Minutes" value="30min" />
            <Picker.Item label="1 Hour" value="1hr" />
            <Picker.Item label="24 Hours" value="24hr" />
            <Picker.Item label="3 Days" value="3days" />
            <Picker.Item label="1 Week" value="1week" />
            <Picker.Item label="1 Month" value="1month" />
            <Picker.Item label="3 Months" value="3months" />
            <Picker.Item label="6 Months" value="6months" />
            <Picker.Item label="1 Year" value="1year" />
            <Picker.Item label="3 Years" value="3years" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f7fc",
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: "#3e64ff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#3e64ff",
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fefefe",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3e64ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
