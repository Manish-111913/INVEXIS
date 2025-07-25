import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const TABS = ['Daily', 'Weekly', 'Monthly', 'Custom'];

const REPORTS = [
  { id: '1', title: 'Daily Sales', date: '2024-05-15', summary: '₹12,849' },
  { id: '2', title: 'Inventory Usage', date: '2024-05-15', summary: '18 kg used' },
  { id: '3', title: 'Wastage', date: '2024-05-15', summary: '2 kg wasted' },
];

export default function Reports({ onBack }) {
  const [tab, setTab] = useState('Daily');

  // For simplicity, all reports are shown; you can filter based on tab if needed
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <MaterialIcons name="file-download" size={24} color="#fff" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report List */}
      <FlatList
        data={REPORTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reportItem}>
            <View>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportDate}>{item.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.reportSummary}>{item.summary}</Text>
              <Ionicons name="chevron-forward" size={22} color="#888" />
            </View>
          </TouchableOpacity>
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
          <Ionicons name="bar-chart" size={28} color="#007bff" />
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
  exportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007bff', padding: 8, borderRadius: 8 },
  exportBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 6, fontSize: 16 },
  tabsRow: { flexDirection: 'row', marginBottom: 8 },
  tabBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  tabBtnActive: { backgroundColor: '#007bff' },
  tabText: { color: '#555', fontSize: 15 },
  tabTextActive: { color: '#fff' },
  reportItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  reportTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  reportDate: { color: '#888', fontSize: 13 },
  reportSummary: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', marginTop: 10 },
});
