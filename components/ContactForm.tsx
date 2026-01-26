import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        Alert.alert("Success", "Message sent successfully!");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while sending the message.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Subject" value={subject} onChangeText={setSubject} />
      <TextInput style={[styles.input, styles.textarea]} placeholder="Message" value={message} onChangeText={setMessage} multiline />
      <Button title="Send Message" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  textarea: { height: 80 },
});
