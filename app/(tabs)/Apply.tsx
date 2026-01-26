import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Apply() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("1 Month");
  const [files, setFiles] = useState<any[]>([]);

  // File upload
  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.canceled === false) {
      setFiles([...files, res.assets[0]]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Application Form</Text>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Duration Picker */}
      <Text style={styles.label}>Duration</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={duration}
          style={styles.picker}
          onValueChange={(val: string) => setDuration(val)}
        >
          <Picker.Item label="1 Month" value="1 Month" />
          <Picker.Item label="3 Months" value="3 Months" />
          <Picker.Item label="6 Months" value="6 Months" />
        </Picker>
      </View>

      {/* File Upload */}
      <Text style={styles.label}>Upload Documents</Text>
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Pick a Document</Text>
      </TouchableOpacity>

      {files.map((file, index) => (
        <Text key={index} style={styles.fileText}>
          {file.name}
        </Text>
      ))}

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F4F6F9", flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
  },
  picker: { height: 50, width: "100%" },
  button: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  fileText: { fontSize: 14, marginTop: 5, color: "#333" },
  submitButton: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
