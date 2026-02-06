import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= BACKEND ================= */
const BASE_URL = "https://fhserver.org.fh260.org";

/* ================= TYPES ================= */
type Fund = {
  id: string;
  description: string;
  requestedBy: string;
  requestType: string;
  category: string;
  totalRequest: number;
  currency: {
    code: string;
    symbol: string;
  };
  status: string;
  dateApproved: string;
  type: "request" | "transfer";
  items?: {
    description: string;
    amount: number;
    quantity: number;
    subCategory: string;
  }[];
};

type Accounts = {
  expenditureAmount: number;
  receiptsAmount: number;
  balanceAmount: number;
  currency_code: string;
};

type UserRole = "admin" | "employee";

export default function Home() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Accounts>({
    expenditureAmount: 0,
    receiptsAmount: 0,
    balanceAmount: 0,
    currency_code: "KES",
  });

  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* ================= APPROVAL STATES ================= */
  const [requiredActions, setRequiredActions] = useState<Fund[]>([]);
  const [showAction, setShowAction] = useState(false);
  const [loadingActions, setLoadingActions] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [userRole, setUserRole] = useState<UserRole>("employee");
  const [categories, setCategories] = useState<string[]>([]);

  const ITEMS_PER_PAGE = 1; // Show one item at a time for pagination

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    checkAuth();
    loadProfile();
    loadAccounts();
    loadTheme();
    loadUserRole();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) router.replace("/Signin");
  };

  const loadTheme = async () => {
    const theme = await AsyncStorage.getItem("theme");
    setDarkMode(theme === "dark");
  };

  /* ================= USER ROLE ================= */
  const loadUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userDataStr = await AsyncStorage.getItem("user");

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const country = userData.country || "Kenya";
        const role: UserRole = country === "USA" ? "admin" : "employee";
        setUserRole(role);
        console.log("User role loaded:", role, "Country:", country);
      }
    } catch (err) {
      console.log("Error loading user role:", err);
      setUserRole("employee"); // Default fallback
    }
  };

  /* ================= PROFILE ================= */
  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUserName(data.name || "User");
      setProfileImage(data.profilePhoto || null);
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/Signin");
  };

  /* ================= DARK MODE ================= */
  const toggleTheme = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
  };

  /* ================= ACCOUNTS ================= */
  const loadAccounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/user-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.log("Accounts error:", err);
    }
  };

  /* ================= CATEGORIES FETCH ================= */
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/disbursed-funds/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const cats = await res.json();
        setCategories(cats);
        console.log("Categories loaded:", cats);
      }
    } catch (err) {
      console.log("Categories error:", err);
    }
  };

  /* ================= REQUIRED ACTIONS FETCH ================= */
  const fetchRequiredActions = async () => {
    try {
      setLoadingActions(true);
      const token = await AsyncStorage.getItem("token");

      console.log("Fetching disbursed funds...");

      // Fetch all disbursed funds (same endpoint as disbursed-funds page)
      const res = await fetch(`${BASE_URL}/api/disbursed-funds`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Disbursed funds response:", data);

      let funds: Fund[] = [];

      if (data.funds && Array.isArray(data.funds)) {
        funds = data.funds;
      } else if (Array.isArray(data)) {
        funds = data;
      }

      console.log("Total funds:", funds.length);

      // Filter funds that require action based on status and user role
      const actionsNeeded = funds.filter((fund) => {
        const status = fund.status.toLowerCase();
        const isOwnRequest = fund.requestedBy === userName;

        console.log(
          `Fund ${fund.id}: status=${status}, role=${userRole}, isOwn=${isOwnRequest}`,
        );

        // Employee actions
        if (userRole === "employee") {
          // Colleague pending - but not own request
          if (status === "colleague_pending" && !isOwnRequest) {
            return true;
          }
          // Pending - needs receipt upload
          if (status === "pending") {
            return true;
          }
          // Uncleared - needs clearing
          if (status === "uncleared") {
            return true;
          }
        }

        // Admin actions
        if (userRole === "admin") {
          // Boss pending - admin needs to approve
          if (status === "boss_pending") {
            return true;
          }
        }

        return false;
      });

      console.log("Actions needed:", actionsNeeded.length, actionsNeeded);
      setRequiredActions(actionsNeeded);
      setCurrentPage(0); // Reset to first page
    } catch (err: any) {
      console.error("Required actions error:", err);
      Alert.alert(
        "Failed to Load Actions",
        err.message || "Could not fetch required actions.",
        [{ text: "OK" }],
      );
      setRequiredActions([]);
    } finally {
      setLoadingActions(false);
    }
  };

  /* ================= REQUEST APPROVAL ACTIONS ================= */
  const handleRequestAction = async (
    requestId: string,
    action:
      | "colleague-approve"
      | "colleague-reject"
      | "boss-approve"
      | "boss-reject",
  ) => {
    const isApprove = action.includes("approve");
    const actionText = isApprove ? "approve" : "reject";

    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Request`,
      `Are you sure you want to ${actionText} this request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          style: isApprove ? "default" : "destructive",
          onPress: async () => {
            try {
              setProcessingId(requestId);
              const token = await AsyncStorage.getItem("token");
              const numericId = requestId.replace(/\D/g, "");

              // Step 1: Get the approval token
              console.log(`Fetching approval token for request ${numericId}`);
              const tokenResponse = await fetch(
                `${BASE_URL}/api/requests/${numericId}/get-token?action=${action}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (!tokenResponse.ok) {
                throw new Error("Failed to retrieve approval token");
              }

              const { approvalToken } = await tokenResponse.json();

              // Step 2: Call the approval endpoint
              const response = await fetch(
                `${BASE_URL}/api/requests/${numericId}/${action}?token=${encodeURIComponent(
                  approvalToken,
                )}&source=mobile`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Action failed");
              }

              Alert.alert("Success", `Request ${actionText}d successfully!`);
              await fetchRequiredActions(); // Refresh list
            } catch (error: any) {
              console.error(`Request ${actionText} error:`, error);
              Alert.alert(
                "Error",
                `Failed to ${actionText} request: ${error.message}`,
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  /* ================= TRANSFER APPROVAL ACTIONS ================= */
  const handleTransferAction = async (
    transferId: string,
    action:
      | "colleague-approve"
      | "colleague-reject"
      | "boss-approve"
      | "boss-reject",
  ) => {
    const isApprove = action.includes("approve");
    const actionText = isApprove ? "approve" : "reject";

    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Transfer`,
      `Are you sure you want to ${actionText} this transfer?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          style: isApprove ? "default" : "destructive",
          onPress: async () => {
            try {
              setProcessingId(transferId);
              const token = await AsyncStorage.getItem("token");
              const numericId = transferId.replace(/\D/g, "");

              // Step 1: Get the approval token
              console.log(`Fetching approval token for transfer ${numericId}`);
              const tokenResponse = await fetch(
                `${BASE_URL}/api/funds-transfer/${numericId}/get-token?action=${action}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (!tokenResponse.ok) {
                throw new Error("Failed to retrieve approval token");
              }

              const { approvalToken } = await tokenResponse.json();

              // Step 2: Call the approval endpoint
              const response = await fetch(
                `${BASE_URL}/api/funds-transfer/${numericId}/${action}?token=${encodeURIComponent(
                  approvalToken,
                )}&source=mobile`,
                {
                  method: "GET",
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Action failed");
              }

              Alert.alert("Success", `Transfer ${actionText}d successfully!`);
              await fetchRequiredActions(); // Refresh list
            } catch (error: any) {
              console.error(`Transfer ${actionText} error:`, error);
              Alert.alert(
                "Error",
                `Failed to ${actionText} transfer: ${error.message}`,
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
    );
  };

  /* ================= RENDER ACTION BUTTONS ================= */
  const renderActionButtons = (fund: Fund) => {
    const status = fund.status.toLowerCase();
    const isTransfer = fund.type === "transfer";
    const isOwnRequest = fund.requestedBy === userName;

    // Pending status
    if (status === "pending") {
      if (userRole === "employee") {
        return (
          <TouchableOpacity
            style={[styles.actionBtn, styles.uploadBtn]}
            onPress={() => router.push("/Receipts")}
          >
            <MaterialIcons name="upload" size={18} color="#fff" />
            <Text style={styles.btnText}>Upload Receipt</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={styles.noActionContainer}>
            <Text style={styles.noActionText}>Send Reminder (Coming Soon)</Text>
          </View>
        );
      }
    }

    // Colleague Pending
    if (status === "colleague_pending") {
      if (userRole === "employee" && !isOwnRequest) {
        const approveAction = isTransfer
          ? "colleague-approve"
          : "colleague-approve";
        const rejectAction = isTransfer
          ? "colleague-reject"
          : "colleague-reject";
        const handler = isTransfer ? handleTransferAction : handleRequestAction;

        return (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.rejectBtn,
                processingId === fund.id && styles.disabledBtn,
              ]}
              onPress={() => handler(fund.id, rejectAction as any)}
              disabled={processingId === fund.id}
            >
              {processingId === fund.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="close" size={18} color="#fff" />
                  <Text style={styles.btnText}>
                    Reject {isTransfer ? "Transfer" : "Request"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.approveBtn,
                processingId === fund.id && styles.disabledBtn,
              ]}
              onPress={() => handler(fund.id, approveAction as any)}
              disabled={processingId === fund.id}
            >
              {processingId === fund.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="check" size={18} color="#fff" />
                  <Text style={styles.btnText}>
                    Approve {isTransfer ? "Transfer" : "Request"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={styles.noActionContainer}>
          <Text style={styles.noActionText}>
            {isOwnRequest ? "No Action (Your Request)" : "No Action Required"}
          </Text>
        </View>
      );
    }

    // Boss Pending
    if (status === "boss_pending") {
      if (userRole === "admin") {
        const approveAction = isTransfer ? "boss-approve" : "boss-approve";
        const rejectAction = isTransfer ? "boss-reject" : "boss-reject";
        const handler = isTransfer ? handleTransferAction : handleRequestAction;

        return (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.rejectBtn,
                processingId === fund.id && styles.disabledBtn,
              ]}
              onPress={() => handler(fund.id, rejectAction as any)}
              disabled={processingId === fund.id}
            >
              {processingId === fund.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="close" size={18} color="#fff" />
                  <Text style={styles.btnText}>
                    Reject {isTransfer ? "Transfer" : "Request"}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.approveBtn,
                processingId === fund.id && styles.disabledBtn,
              ]}
              onPress={() => handler(fund.id, approveAction as any)}
              disabled={processingId === fund.id}
            >
              {processingId === fund.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="check" size={18} color="#fff" />
                  <Text style={styles.btnText}>
                    Approve {isTransfer ? "Transfer" : "Request"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <View style={styles.noActionContainer}>
          <Text style={styles.noActionText}>No Action Required</Text>
        </View>
      );
    }

    // Uncleared
    if (status === "uncleared") {
      if (userRole === "employee") {
        return (
          <TouchableOpacity
            style={[styles.actionBtn, styles.clearBtn]}
            onPress={() => router.push("/Receipts")}
          >
            <MaterialIcons name="check-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>Clear Transfer</Text>
          </TouchableOpacity>
        );
      }
    }

    return (
      <View style={styles.noActionContainer}>
        <Text style={styles.noActionText}>No Action Required</Text>
      </View>
    );
  };

  /* ================= PAGINATION ================= */
  const currentItem = requiredActions[currentPage];
  const totalPages = requiredActions.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  /* ================= FOREX ================= */
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("KES");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`)
      .then((r) => r.json())
      .then((d) => setRate(d?.rates?.[to]));
  }, [from, to]);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const converted =
    rate && amount ? (parseFloat(amount) * rate).toFixed(2) : "--";

  /* ================= GREETING ================= */
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  };

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return "#FFA500";
    if (s === "colleague_pending") return "#FFD700";
    if (s === "boss_pending") return "#FF6347";
    if (s === "uploaded") return "#32CD32";
    if (s === "uncleared") return "#1E90FF";
    if (s === "cleared") return "#228B22";
    return "#888";
  };

  /* ================= UI ================= */
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0A0F2C" : "#f2f2f2" },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ height: 38 }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => setShowProfileMenu(!showProfileMenu)}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImg} />
          ) : (
            <Text style={styles.profileText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.homeText}>Home</Text>
        <Ionicons name="notifications-outline" size={22} color="#0B3F73" />
      </View>

      {showProfileMenu && (
        <View style={styles.profileMenu}>
          <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
            <Text>Dark Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout} style={styles.menuItem}>
            <Text style={{ color: "red" }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>
          {getGreeting()},{" "}
          <Text style={{ fontWeight: "bold" }}>{userName}</Text>
        </Text>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          {[
            { label: "Track", icon: "account-balance", route: "/Track" },
            { label: "Apply", icon: "assignment", route: "/Apply" },
            { label: "Receipts", icon: "receipt", route: "/Receipts" },
            { label: "Downloads", icon: "download", route: "/Downloads" },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons
                  name={item.icon as any}
                  size={22}
                  color="#8B0000"
                />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MAROON BUTTONS */}
        <View style={styles.actionsRow}>
          {[
            { label: "Admin", icon: "admin-panel-settings", route: "/Admin" },
            { label: "Transfer", icon: "swap-horiz", route: "/Transfer" },
            {
              label: "Reminder",
              icon: "notifications-active",
              route: "/Reminder",
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.redCircle}>
                <MaterialIcons name={item.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.actionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* REQUIRED ACTION */}
        <View style={styles.requiredCard}>
          <View style={styles.balanceRow}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Required Action
            </Text>

            <TouchableOpacity
              onPress={() => {
                const next = !showAction;
                setShowAction(next);
                if (next) {
                  fetchRequiredActions();
                  fetchCategories();
                }
              }}
            >
              <Ionicons
                name={showAction ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {showAction && (
            <>
              {loadingActions ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="large" />
                  <Text style={{ color: "#fff", marginTop: 10 }}>
                    Loading required actions...
                  </Text>
                </View>
              ) : requiredActions.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons
                    name="check-circle"
                    size={48}
                    color="#90EE90"
                  />
                  <Text style={styles.emptyText}>All actions complete</Text>
                  <Text style={styles.emptySubtext}>
                    You have no pending actions at this time
                  </Text>
                </View>
              ) : (
                <View>
                  {/* Pagination Info */}
                  <View style={styles.paginationHeader}>
                    <Text style={{ color: "#fff", fontSize: 13 }}>
                      Action {currentPage + 1} of {totalPages}
                    </Text>
                    <View style={styles.paginationControls}>
                      <TouchableOpacity
                        style={[
                          styles.pageBtn,
                          currentPage === 0 && styles.pageBtnDisabled,
                        ]}
                        onPress={goToPreviousPage}
                        disabled={currentPage === 0}
                      >
                        <MaterialIcons
                          name="chevron-left"
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.pageBtn,
                          currentPage === totalPages - 1 &&
                            styles.pageBtnDisabled,
                        ]}
                        onPress={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                      >
                        <MaterialIcons
                          name="chevron-right"
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Current Item */}
                  {currentItem && (
                    <View style={styles.approvalItem}>
                      {/* Header */}
                      <View style={styles.approvalHeader}>
                        <View
                          style={[
                            styles.typeBadge,
                            currentItem.type === "transfer"
                              ? styles.transferBadge
                              : styles.requestBadge,
                          ]}
                        >
                          <MaterialIcons
                            name={
                              currentItem.type === "transfer"
                                ? "swap-horiz"
                                : "assignment"
                            }
                            size={14}
                            color="#fff"
                          />
                          <Text style={styles.badgeText}>
                            {currentItem.type === "transfer"
                              ? "TRANSFER"
                              : "REQUEST"}
                          </Text>
                        </View>

                        <Text style={styles.approvalId}>#{currentItem.id}</Text>
                      </View>

                      {/* Status Badge */}
                      <View style={styles.statusContainer}>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                currentItem.status,
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {currentItem.status
                              .toUpperCase()
                              .replace(/_/g, " ")}
                          </Text>
                        </View>
                      </View>

                      {/* Content */}
                      <View style={styles.approvalContent}>
                        {/* Description */}
                        <View style={styles.infoRow}>
                          <MaterialIcons
                            name="description"
                            size={16}
                            color="#FFD700"
                          />
                          <Text style={styles.infoLabel}>Description:</Text>
                        </View>
                        <Text style={styles.descriptionValue}>
                          {currentItem.description}
                        </Text>

                        {/* Category */}
                        <View style={styles.infoRow}>
                          <MaterialIcons
                            name="category"
                            size={16}
                            color="#FFD700"
                          />
                          <Text style={styles.infoLabel}>Category:</Text>
                          <Text style={styles.infoValue}>
                            {currentItem.category}
                          </Text>
                        </View>

                        {/* Requester */}
                        <View style={styles.infoRow}>
                          <MaterialIcons
                            name="person"
                            size={16}
                            color="#90EE90"
                          />
                          <Text style={styles.infoLabel}>Requester:</Text>
                          <Text style={styles.infoValue}>
                            {currentItem.requestedBy}
                          </Text>
                        </View>

                        {/* Amount */}
                        <View style={styles.infoRow}>
                          <MaterialIcons
                            name="attach-money"
                            size={16}
                            color="#87CEEB"
                          />
                          <Text style={styles.infoLabel}>Amount:</Text>
                          <Text style={styles.amountValue}>
                            {currentItem.currency.symbol}{" "}
                            {currentItem.totalRequest.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </Text>
                        </View>

                        {/* Date */}
                        <View style={styles.infoRow}>
                          <MaterialIcons
                            name="calendar-today"
                            size={16}
                            color="#FFA07A"
                          />
                          <Text style={styles.infoLabel}>Date:</Text>
                          <Text style={styles.infoValue}>
                            {new Date(
                              currentItem.dateApproved,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Text>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={{ marginTop: 12 }}>
                        {renderActionButtons(currentItem)}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>

        {/* ACCOUNTS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { title: "Expenditure", value: accounts.expenditureAmount },
            { title: "Receipts", value: accounts.receiptsAmount },
            { title: "Balance", value: accounts.balanceAmount },
          ].map((a, i) => (
            <View key={i} style={styles.accountCard}>
              <Text style={styles.accountTitle}>{a.title}</Text>
              <Text style={styles.accountAmount}>
                {a.value} {accounts.currency_code}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* FOREX */}
        <View style={styles.forexCard}>
          <Text style={styles.sectionTitle}>Forex Calculator</Text>

          <View style={styles.forexRow}>
            <TouchableOpacity
              style={styles.currencyBox}
              onPress={swapCurrencies}
            >
              <Text>{from}</Text>
            </TouchableOpacity>

            <Ionicons name="swap-horizontal" size={26} color="#0B3F73" />

            <TouchableOpacity
              style={styles.currencyBox}
              onPress={swapCurrencies}
            >
              <Text>{to}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.amountInput}
          />

          <Text>Rate: {rate ?? "--"}</Text>
          <Text>Converted: {converted}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 15 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#0B3F73",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  profileImg: { width: 36, height: 36, borderRadius: 18 },
  profileText: { color: "#0B3F73", fontWeight: "bold" },
  homeText: { fontWeight: "bold" },

  profileMenu: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },

  menuItem: { padding: 10 },

  greeting: { fontSize: 18, marginVertical: 10 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  actionItem: { alignItems: "center", width: 70 },
  actionIcon: { backgroundColor: "#fff", padding: 12, borderRadius: 30 },
  actionText: { fontSize: 12, marginTop: 5 },

  redCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0A0F2C",
    alignItems: "center",
    justifyContent: "center",
  },

  requiredCard: {
    backgroundColor: "#8B0000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  loadingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  emptySubtext: {
    color: "#ddd",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  paginationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },

  paginationControls: {
    flexDirection: "row",
    gap: 8,
  },

  pageBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 6,
  },

  pageBtnDisabled: {
    opacity: 0.3,
  },

  approvalItem: {
    padding: 14,
    backgroundColor: "#6E0000",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },

  approvalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  transferBadge: {
    backgroundColor: "#4A90E2",
  },

  requestBadge: {
    backgroundColor: "#E2A14A",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  approvalId: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "bold",
  },

  statusContainer: {
    marginBottom: 10,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  approvalContent: {
    gap: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoLabel: {
    color: "#ddd",
    fontSize: 13,
    fontWeight: "500",
  },

  infoValue: {
    color: "#fff",
    fontSize: 13,
    flex: 1,
  },

  descriptionValue: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 22,
    marginBottom: 6,
    fontStyle: "italic",
  },

  amountValue: {
    color: "#90EE90",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },

  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },

  approveBtn: {
    backgroundColor: "#28a745",
  },

  rejectBtn: {
    backgroundColor: "#dc3545",
  },

  uploadBtn: {
    backgroundColor: "#007bff",
  },

  clearBtn: {
    backgroundColor: "#17a2b8",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  noActionContainer: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    alignItems: "center",
  },

  noActionText: {
    color: "#ddd",
    fontSize: 13,
    fontStyle: "italic",
  },

  accountCard: {
    backgroundColor: "#0B3F73",
    padding: 35,
    borderRadius: 10,
    marginRight: 10,
    width: 250,
  },

  accountTitle: { color: "#fff" },
  accountAmount: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  forexCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  forexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  currencyBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    width: 120,
  },

  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
});
