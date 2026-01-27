import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Task() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroTitle}>📅 Task Management Tool</Text>
            <Text style={styles.heroSubtitle}>
              Viewing all tasks from your country
            </Text>
          </View>

          <View style={styles.notificationBell}>
            <Ionicons name="notifications-outline" size={24} color="#8B0000" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>

        {/* FEATURE CARD */}
        <View style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>
              Task <Text style={styles.rating}>100%</Text>
            </Text>

            <Text style={styles.listItem}>✔ Tracking Title</Text>
            <Text style={styles.listItem}>✔ Description</Text>
            <Text style={styles.listItem}>✔ Date & Time</Text>
            <Text style={styles.listItem}>✔ Priority</Text>
          </View>

          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add Task +</Text>
          </TouchableOpacity>
        </View>

        {/* TASK LIST */}
        <Text style={styles.sectionTitle}>📌 All Tasks from Your Country</Text>

        <View style={styles.taskList}>
          <Text style={{ color: "#666" }}>Loading...</Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Task Completion Summary</Text>
          <Text style={styles.summaryText}>
            Completed: <Text style={{ fontWeight: "bold" }}>0</Text> of{" "}
            <Text style={{ fontWeight: "bold" }}>0</Text>
          </Text>

          <View style={styles.progressBar}>
            <View style={styles.progressInner} />
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Record, Remember, and Do!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 38, // ✅ 1 cm from top
  },

  scroll: {
    padding: 15,
  },

  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  heroSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },

  notificationBell: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#8B0000",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  rating: {
    color: "green",
    fontSize: 14,
  },

  listItem: {
    fontSize: 13,
    color: "#444",
    marginVertical: 2,
  },

  addBtn: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  taskList: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },

  summaryText: {
    fontSize: 13,
    marginBottom: 8,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressInner: {
    width: "0%",
    height: "100%",
    backgroundColor: "#0B3F73",
  },

  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  footerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
