import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const VENDORS = [
  { id: '1', name: 'FreshMart', contact: '9876543210', outstanding: 1200 },
  { id: '2', name: 'Spice World', contact: '9123456789', outstanding: 0 },
];

export default function VendorManagement({ onBack }) {
  const [search, setSearch] = React.useState('');

  const filteredVendors = VENDORS.filter(vendor =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Vendors</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addBtnText}>Add Vendor</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search vendors..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Vendor List */}
      <FlatList
        data={filteredVendors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.vendorItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorContact}>Contact: {item.contact}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.outstandingLabel}>Outstanding</Text>
              <Text style={styles.outstandingValue}>₹{item.outstanding}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity>
                  <Feather name="phone-call" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 12 }}>
                  <MaterialIcons name="shopping-cart" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 12 }}>
                  <Ionicons name="information-circle-outline" size={20} color="#007bff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom Navigation */}
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
          <Ionicons name="people" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingTop: 40, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', padding: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 6, fontSize: 16 },
  searchBar: { backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 14, borderWidth: 1, borderColor: '#eee' },
  vendorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  vendorName: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  vendorContact: { color: '#888', fontSize: 13 },
  outstandingLabel: { fontSize: 12, color: '#888' },
  outstandingValue: { color: '#e67e22', fontWeight: 'bold', fontSize: 15 },
  actionRow: { flexDirection: 'row', marginTop: 6 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', marginTop: 10 },
});
