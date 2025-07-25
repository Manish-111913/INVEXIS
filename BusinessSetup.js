import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const BUSINESS_TYPES = [
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'cafe', label: 'Cafe' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'bar', label: 'Bar' },
];

const BUSINESS_SIZES = [
  { key: 'very_small', label: 'Very Small', detail: '1-5 workers', min: 1, max: 5 },
  { key: 'small', label: 'Small', detail: '6-15 workers', min: 6, max: 15 },
  { key: 'medium', label: 'Medium', detail: '16-50 workers', min: 16, max: 50 },
  { key: 'large', label: 'Large', detail: '51+ workers', min: 51, max: 9999 },
];

const BILLING_MODELS = [
  { key: 'terminal', label: 'Terminal (Computer)', desc: 'Upload PDF reports' },
  { key: 'pos', label: 'POS (Point of Sale)', desc: 'Upload sales files' },
  { key: 'qr', label: 'QR', desc: 'Use Invexis for QR billing' },
];

export default function BusinessSetup({ onFinish }) {
  const [businessType, setBusinessType] = useState('');
  const [numWorkers, setNumWorkers] = useState(1);
  const [billingModel, setBillingModel] = useState('');

  // Auto-suggest business size based on numWorkers
  const suggestedSize = BUSINESS_SIZES.find(
    s => numWorkers >= s.min && numWorkers <= s.max
  ) || BUSINESS_SIZES[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* INVEXIS Name */}
        <Text style={styles.invexisName}>INVEXIS</Text>

        {/* Progress Bar */}
        <Text style={styles.progressTitle}>Help us customize Invexis for your specific needs</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: '75%' }]} />
        </View>
        <Text style={styles.progressStep}>3 of 4 steps completed</Text>

        {/* Business Type */}
        <View style={[
          styles.card,
          businessType ? styles.cardGreen : styles.cardNormal
        ]}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={20} color={businessType ? "#34c759" : "#ccc"} />
            <MaterialIcons name="business-center" size={20} color="#ff6600" style={{ marginLeft: 6 }} />
            <Text style={styles.cardTitle}>Business Type</Text>
          </View>
          <View style={businessType ? styles.dropdownBoxGreen : styles.dropdownBox}>
            <Picker
              selectedValue={businessType}
              onValueChange={setBusinessType}
              style={styles.picker}
              dropdownIconColor="#222"
            >
              <Picker.Item label="Select business type" value="" />
              {BUSINESS_TYPES.map((type) => (
                <Picker.Item key={type.key} label={type.label} value={type.key} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Number of Workers */}
        <View style={[
          styles.card,
          numWorkers > 0 ? styles.cardGreen : styles.cardNormal
        ]}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={20} color={numWorkers > 0 ? "#34c759" : "#ccc"} />
            <Ionicons name="people" size={20} color="#ff6600" style={{ marginLeft: 6 }} />
            <Text style={styles.cardTitle}>Number of Workers</Text>
          </View>
          <View style={numWorkers > 0 ? styles.stepperBoxGreen : styles.stepperBox}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setNumWorkers(Math.max(1, numWorkers - 1))}
            >
              <Text style={styles.stepperBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.stepperValueBox}>
              <Text style={styles.stepperValue}>{numWorkers}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setNumWorkers(numWorkers + 1)}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Size of Business (Auto-suggested) */}
        <View style={[
          styles.card,
          suggestedSize ? styles.cardGreen : styles.cardNormal
        ]}>
          <View style={styles.cardHeader}>
            <Ionicons name="checkmark-circle" size={20} color={suggestedSize ? "#34c759" : "#ccc"} />
            <MaterialIcons name="apartment" size={20} color="#ff6600" style={{ marginLeft: 6 }} />
            <Text style={styles.cardTitle}>Size of Business</Text>
            <Text style={styles.autoSuggested}>Auto-suggested</Text>
          </View>
          <View style={suggestedSize ? styles.dropdownBoxGreen : styles.dropdownBox}>
            <Picker
              selectedValue={suggestedSize.key}
              enabled={false}
              style={styles.picker}
              dropdownIconColor="#34c759"
            >
              {BUSINESS_SIZES.map((size) => (
                <Picker.Item
                  key={size.key}
                  label={`${size.label}\n${size.detail}`}
                  value={size.key}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Billing Machine Type */}
        <View style={[
          styles.card,
          billingModel ? styles.cardGreen : styles.cardNormal
        ]}>
          <View style={styles.cardHeader}>
            <View style={styles.circleNum}><Text style={styles.circleNumText}>4</Text></View>
            <MaterialIcons name="point-of-sale" size={20} color="#ff6600" style={{ marginLeft: 6 }} />
            <Text style={styles.cardTitle}>Billing Machine Type</Text>
          </View>
          <View style={billingModel ? styles.dropdownBoxGreen : styles.dropdownBox}>
            <Picker
              selectedValue={billingModel}
              onValueChange={setBillingModel}
              style={styles.picker}
              dropdownIconColor="#222"
            >
              <Picker.Item label="Select machine type" value="" />
              {BILLING_MODELS.map((model) => (
                <Picker.Item key={model.key} label={model.label} value={model.key} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            !(businessType && billingModel) && { backgroundColor: '#ccc' },
          ]}
          disabled={!(businessType && billingModel)}
          onPress={onFinish}
        >
          <Text style={styles.confirmBtnText}>
            Complete Setup <Text style={styles.arrow}>→</Text>
          </Text>
        </TouchableOpacity>

        {/* Info Paragraph */}
        <Text style={styles.infoPara}>
          This information helps us provide you with best experience.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafbfc' },
  scrollContent: { padding: 24, paddingTop: 56 },
  invexisName: { fontSize: 28, fontWeight: 'bold', color: '#ff6600', textAlign: 'center', marginBottom: 8, letterSpacing: 2 },
  progressTitle: { fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: '#eee', borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  progressBar: { height: 6, backgroundColor: '#ff6600', borderRadius: 3 },
  progressStep: { color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  cardNormal: { borderColor: '#ddd', borderWidth: 1 },
  cardGreen: { borderColor: '#34c759', borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#222', marginLeft: 8 },
  autoSuggested: { marginLeft: 8, color: '#34c759', fontWeight: 'bold', fontSize: 12, backgroundColor: '#eaffea', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  dropdownBox: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginTop: 2 },
  dropdownBoxGreen: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#34c759', marginTop: 2 },
  picker: { height: 48, width: '100%', color: '#222' },
  stepperBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginTop: 2 },
  stepperBoxGreen: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 8, borderWidth: 1, borderColor: '#34c759', marginTop: 2 },
  stepperBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  stepperBtnText: { fontSize: 24, color: '#34c759', fontWeight: 'bold' },
  stepperValueBox: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  circleNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff2e6', alignItems: 'center', justifyContent: 'center' },
  circleNumText: { color: '#ff6600', fontWeight: 'bold' },
  confirmBtn: { marginTop: 18, backgroundColor: '#ff6600', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  arrow: { fontSize: 20, fontWeight: 'bold' },
  infoPara: { color: '#888', fontSize: 13, textAlign: 'center', marginTop: 16, marginBottom: 24 },
});
