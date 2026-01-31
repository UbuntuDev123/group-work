import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- TYPES ---------- */
type Reminder = {
  title: string;
  date: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Completed";
};

/* ---------- SAMPLE DATA ---------- */
const REMINDERS: Reminder[] = [
  {
    title: "Team Meeting",
    date: "12/01/2026",
    time: "10:00 AM",
    priority: "High",
    status: "Active",
  },
  {
    title: "Submit Report",
    date: "12/03/2026",
    time: "4:00 PM",
    priority: "Medium",
    status: "Completed",
  },
];

export default function Reminder() {
  const router = useRouter();
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  const filteredReminders =
    filter === "ALL"
      ? REMINDERS
      : REMINDERS.filter((r) =>
          filter === "ACTIVE" ? r.status === "Active" : r.status === "Completed",
        );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#8B0000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Reminders</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* ---------- FILTER ---------- */}
          <View style={styles.filterCard}>
            <Text style={styles.filterLabel}>Filter Reminders</Text>

            <View style={styles.filterRow}>
              {["ALL", "ACTIVE", "COMPLETED"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.filterBtn,
                    filter === item && styles.filterBtnActive,
                  ]}
                  onPress={() => setFilter(item as any)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ---------- REMINDERS ---------- */}
          {filteredReminders.map((item, index) => (
            <View key={index} style={styles.reminderCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Title</Text>
                <Text style={styles.value}>{item.title}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{item.date}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{item.time}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Priority</Text>
                <Text
                  style={[
                    styles.priority,
                    item.priority === "High"
                      ? styles.high
                      : item.priority === "Medium"
                        ? styles.medium
                        : styles.low,
                  ]}
                >
                  {item.priority}
                </Text>
              </View>

              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons
                  name={
                    item.status === "Active"
                      ? "notifications-active"
                      : "check-circle"
                  }
                  size={18}
                  color="#fff"
                />
                <Text style={styles.actionText}>
                  {item.status === "Active"
                    ? "Mark as Completed"
                    : "Completed"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  container: {
    flex: 1,
  },

  scroll: {
    padding: 15,
  },

  /* HEADER */
  header: {
    backgroundColor: "#fff",
    paddingTop: 38, // ≈ 1 cm
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  /* FILTER */
  filterCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  filterLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  filterBtnActive: {
    backgroundColor: "#0B3F73",
    borderColor: "#0B3F73",
  },

  filterText: {
    fontSize: 12,
    color: "#333",
  },

  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  /* REMINDER CARD */
  reminderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  value: {
    fontSize: 13,
    fontWeight: "500",
  },

  priority: {
    fontSize: 13,
    fontWeight: "bold",
  },

  high: { color: "#8B0000" },
  medium: { color: "#E6A100" },
  low: { color: "green" },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B3F73",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },
});
