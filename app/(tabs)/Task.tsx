// screens/TaskPlanner.tsx
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function TaskPlanner() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Submit Report",
      due: "2025-07-06",
      priority: "High",
      description: "Financial Statement",
    },
    {
      id: 2,
      title: "Insurance",
      due: "2025-07-08",
      priority: "Medium",
      description: "Insurance to be paid",
    },
  ]);
 const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      <View style={styles.hero}>
  <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
    <Ionicons name="menu" size={26} color="#fff" />
  </TouchableOpacity>
  <Text style={[styles.heroTitle, { marginLeft: 10 }]}>
    📅 Task Management Tool
  </Text>
</View>

      {/* Features */}
      <View style={styles.section}>
        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>Task <Text style={styles.rating}>100%</Text></Text>
          <Text>✔️ Tracking Title</Text>
          <Text>✔️ Description</Text>
          <Text>✔️ Tracking Date</Text>
          <Text>✔️ Tracking Priority</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Task »</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>Appointment <Text style={styles.rating}>100%</Text></Text>
          <Text>✔️ Tracking Name/Place</Text>
          <Text>✔️ Tracking Time</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add Appointment »</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List */}
      <Text style={styles.sectionTitle}>📌 Pending Tasks</Text>
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text>Due: {task.due}</Text>
            <Text>Priority: {task.priority}</Text>
            <Text>Description: {task.description}</Text>
            <TouchableOpacity style={styles.completeBtn}>
              <Text style={{ color: "#fff" }}>✅ Mark as Completed</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>📊 Task Completion Summary</Text>
        <Text>Tasks completed in the past month: 12</Text>
        <Text>Total tasks: 20</Text>
        <Text>Completion Rate:</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressInner, { width: "60%" }]} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={{ color: "#d83d3dff" }}>Record, Remember, and Do!</Text>
        <TouchableOpacity style={styles.footer}>
         <Text style={styles.footerText}>© 2025 Fh260. All rights reserved.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
 hero: {
  backgroundColor: "#0c2340",
  padding: 20,
  flexDirection: "row",   // arrange children in a row
  alignItems: "center",   // vertically center items
},
  
  heroTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  section: { padding: 20 },
  toolCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: "#3e64ff",
  },
  toolTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  rating: { color: "#f90", fontWeight: "bold" },
  button: {
    marginTop: 10,
    backgroundColor: "#3e64ff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    marginLeft: 15,
  },
  taskList: { paddingHorizontal: 20 },
  taskCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: "#00b894",
  },
  taskTitle: { fontWeight: "bold", fontSize: 16 },
  completeBtn: {
    marginTop: 10,
    backgroundColor: "#00b894",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  summary: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  progressBar: {
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginTop: 10,
    overflow: "hidden",
  },
  progressInner: {
    backgroundColor: "#00b894",
    height: 20,
  },
//   footer: {
//     backgroundColor: "#151a21",
//     padding: 20,
//     alignItems: "center",
//   },
//   footerBtn: {
//     backgroundColor: "#ff6a00",
//     marginTop: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
  footer: { backgroundColor: "#003366", padding: 15, alignItems: "center" },
  footerText: { color: "white", fontSize: 12 },
});
