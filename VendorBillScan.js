import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const RECENT_BILLS = [
  { id: '1', vendor: 'FreshMart', date: '2024-05-15', status: 'Processed' },
  { id: '2', vendor: 'Spice World', date: '2024-05-14', status: 'Pending' },
];

export default function VendorBillScan({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan Vendor Bill</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.instructions}>
        Take a photo or upload a bill to update inventory automatically.
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.scanBtn}>
          <Ionicons name="camera" size={28} color="#fff" />
          <Text style={styles.scanBtnText}>Scan Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn}>
          <MaterialIcons name="file-upload" size={28} color="#007bff" />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Recent Scans</Text>
      <FlatList
        data={RECENT_BILLS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Ionicons name="document-text" size={24} color="#007bff" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.vendorName}>{item.vendor}</Text>
              <Text style={styles.billDetails}>{item.date} • {item.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#888" />
          </View>
        )}
      />
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="restaurant-menu" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bar-chart" size={28} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="people" size={28} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingTop: 40, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  instructions: { color: '#555', fontSize: 16, marginVertical: 14, textAlign: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', padding: 16, borderRadius: 10 },
  scanBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0ff', padding: 16, borderRadius: 10 },
  uploadBtnText: { color: '#007bff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#007bff', marginBottom: 8, marginTop: 20 },
  billItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  vendorName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  billDetails: { color: '#888', fontSize: 13 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', marginTop: 10 },
});
