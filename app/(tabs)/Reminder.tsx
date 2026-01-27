// screens/AddAppointment.tsx
import emailjs from "@emailjs/browser";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddAppointment() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [reminder, setReminder] = useState("");

  const handleSubmit = async () => {
    if (!name || !time || !reminder) {
      Alert.alert("⚠️ Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID", // replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID", // replace with your EmailJS Template ID
        {
          name,
          time,
          reminder,
          to_email: "kelvinekiganga999@gmail.com",
        },
        "YOUR_PUBLIC_KEY", // replace with your EmailJS Public Key
      );

      Alert.alert("✅ Success", "Appointment successfully sent!");
      setName("");
      setTime("");
      setReminder("");
    } catch (error) {
      console.error("EmailJS Error:", error);
      Alert.alert("❌ Failed", "Could not send appointment.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>➕ Add a New Appointment</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={time}
          onChangeText={setTime}
        />

        <Text style={styles.label}>Reminder</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={reminder}
            onValueChange={(itemValue) => setReminder(itemValue)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fc",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#3e64ff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3e64ff",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fefefe",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3e64ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
