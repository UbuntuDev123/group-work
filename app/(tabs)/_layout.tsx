import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import Apply from "./Apply";
import Downloads from "./Downloads";
import Home from "./Home";
import Receipts from "./Receipts";
import TrackScreen from "./Track";

const Tab = createBottomTabNavigator();

/* ---------- CUSTOM HEADER ---------- */
function CustomHeader() {
  return (
    <View
      style={{
        height: 56,
        backgroundColor: "#0A0F2C",
        justifyContent: "center",
        paddingHorizontal: 16,
      }}
    />
  );
}

/* ---------- TABS LAYOUT ---------- */
export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#0A0F2C",
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: "#0A0F2C",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tab.Screen
        name="Apply"
        component={Apply}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Downloads"
        component={Downloads}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Receipts"
        component={Receipts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="receipt" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="truck-moving" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
