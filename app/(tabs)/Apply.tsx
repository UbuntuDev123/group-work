import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REQUEST_TYPES = ["New", "Reimbursement"];
const CATEGORIES = [
  "Fuel",
  "Borehole Supplies",
  "Construction",
  "Paper Works",
  "Office",
  "Permits",
  "Internet/Electricity",
  "Rent",
  "Vehicle Repair",
  "Expeditions",
  "Transport",
  "Meals",
  "Accommodations",
  "Projects",
  "Training",
  "Vehicle Service",
  "Other",
];
const SUBCATEGORIES = ["None"]; // Can be dynamically added later

export default function FundRequest() {
  const router = useRouter();
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("None");
  const [otherSubCategory, setOtherSubCategory] = useState("");
  const [moneyAtHand, setMoneyAtHand] = useState("0");
  const [transactionCost, setTransactionCost] = useState("");
  const [totalRequest, setTotalRequest] = useState("");
  const [profileVisible, setProfileVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Fund Request</Text>

          {/* Request Type */}
          <Text style={styles.label}>Request Type:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={requestType}
              onValueChange={(value) => setRequestType(value)}
            >
              {REQUEST_TYPES.map((type, i) => (
                <Picker.Item key={i} label={type} value={type} />
              ))}
            </Picker>
          </View>

          {/* Reimbursement Buttons */}
          {requestType === "Reimbursement" && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Upload</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Reconcile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Optional Document Upload */}
          <View style={styles.uploadCard}>
            <Text style={styles.uploadLabel}>
              <FontAwesome name="paperclip" size={14} /> Optional Document
              Attachments
            </Text>
            <Text style={styles.uploadDesc}>
              Upload supporting documents (PDF, Word, Excel). Maximum 10MB per
              file.
            </Text>
            <TouchableOpacity style={styles.uploadBtn}>
              <FontAwesome name="upload" size={16} color="#fff" />
              <Text style={styles.uploadBtnText}>Choose Documents</Text>
            </TouchableOpacity>
          </View>

          {/* Category & Sub-category */}
          <Text style={styles.label}>Category:</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Select category" value="" />
              {CATEGORIES.map((cat, i) => (
                <Picker.Item key={i} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Sub-category:</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={subCategory} onValueChange={setSubCategory}>
              {SUBCATEGORIES.map((sub, i) => (
                <Picker.Item key={i} label={sub} value={sub} />
              ))}
            </Picker>
          </View>

          {subCategory === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Specify Other Sub-category"
              value={otherSubCategory}
              onChangeText={setOtherSubCategory}
            />
          )}

          {/* Money at Hand */}
          <Text style={styles.label}>Money at Hand (Optional):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="No money at hand? Input 0"
            value={moneyAtHand}
            onChangeText={setMoneyAtHand}
          />

          {/* Transaction Cost */}
          <Text style={styles.label}>Transaction Cost (Optional):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter transaction cost"
            value={transactionCost}
            onChangeText={setTransactionCost}
          />

          {/* Total Request */}
          <Text style={styles.label}>Total Request:</Text>
          <TextInput
            style={styles.input}
            value={totalRequest}
            editable={false}
          />

          {/* Proceed & Send Buttons */}
          <TouchableOpacity style={styles.proceedBtn}>
            <Text style={styles.proceedBtnText}>Proceed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.proceedBtn}>
            <Text style={styles.proceedBtnText}>Send and Download Receipt</Text>
          </TouchableOpacity>

          {/* Profile Modal */}
          {profileVisible && (
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setProfileVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalHeader}>Edit Profile</Text>

                <View style={styles.profilePicture}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/80" }}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity style={styles.uploadBtn}>
                    <FontAwesome name="upload" size={16} color="#fff" />
                    <Text style={styles.uploadBtnText}>Upload</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  editable={false}
                />
                <TextInput style={styles.input} placeholder="Role" />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell us about yourself..."
                  multiline
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.saveBtn}>
                    <Text style={{ color: "#fff" }}>Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setProfileVisible(false)}
                  >
                    <Text style={{ color: "#000" }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f2f2" },
  container: { flex: 1 },
  scroll: { padding: 15 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  label: { fontSize: 13, color: "#333", marginTop: 10, marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actionBtn: {
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "bold" },
  uploadCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginVertical: 10,
  },
  uploadLabel: { fontWeight: "bold", marginBottom: 5 },
  uploadDesc: { fontSize: 12, color: "#6c757d", marginBottom: 10 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  uploadBtnText: { color: "#fff", marginLeft: 5, fontWeight: "bold" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  proceedBtn: {
    backgroundColor: "#0d6efd",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  proceedBtnText: { color: "#fff", fontWeight: "bold" },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeBtn: { position: "absolute", top: 10, right: 10 },
  modalHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  profilePicture: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 10 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: "#0d6efd",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
});
