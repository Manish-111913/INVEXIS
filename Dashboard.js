import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

export default function Dashboard({ items, onGoToRecipes, onGoToInventory, onGoToVendorBillScan }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>INVEXIS</Text>
        <Ionicons name="notifications" size={28} color="#e74c3c" />
      </View>
      <Text style={styles.welcome}>Welcome back, Prem!</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Metric Cards Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Today's Sales <Text style={styles.metricUp}>▲ 15%</Text></Text>
            <Text style={styles.metricValueBold}>₹12,849</Text>
          </View>
          <View style={[styles.metricCard, styles.alertCard]}>
            <Text style={styles.metricTitle}>Low Stock Alerts</Text>
            <Text style={styles.metricValueOrange}>3 items</Text>
          </View>
        </View>

        {/* 2x2 Grid Buttons */}
        <View style={styles.gridRow}>
          <View style={styles.gridCol}>
            <TouchableOpacity style={styles.gridBtn} onPress={onGoToVendorBillScan}>
              <MaterialIcons name="document-scanner" size={28} color="#222" />
              <Text style={styles.gridLabel}>Scan Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridBtn} onPress={onGoToInventory}>
              <Feather name="box" size={28} color="#222" />
              <Text style={styles.gridLabel}>Manage Inventory</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridCol}>
            <TouchableOpacity style={styles.gridBtn}>
              <Feather name="bar-chart-2" size={28} color="#222" />
              <Text style={styles.gridLabel}>Today's Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridBtn} onPress={onGoToRecipes}>
              <MaterialIcons name="restaurant-menu" size={28} color="#222" />
              <Text style={styles.gridLabel}>Ingredient Processing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sales Overview Graph Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sales Overview</Text>
            <TouchableOpacity style={styles.timeFilter}>
              <Text style={styles.timeFilterText}>Last 7 days ▼</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.graphText}>[Line Graph Placeholder]</Text>
          </View>
        </View>

        {/* Wastage Cost & Gross Profit (Placeholders) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCardTall}>
            <Text style={styles.metricTitle}>Wastage Cost</Text>
            <Text style={styles.metricValueBlue}>₹2,150 <Text style={styles.metricSubValue}>(Today)</Text></Text>
            <Text style={styles.metricValueOrange}>₹14,500 <Text style={styles.metricSubValue}>(Last 7 Days)</Text></Text>
            <View style={styles.wastageGraphPlaceholder} />
          </View>
          <View style={styles.metricCardTall}>
            <Text style={styles.metricTitle}>Gross Profit</Text>
            <Text style={styles.metricValueGreen}>₹8,500 <Text style={styles.metricSubValue}>(Today)</Text></Text>
            <Text style={styles.metricValue}>COGS <Text style={styles.metricValueOrange}>32%</Text></Text>
          </View>
        </View>

        {/* Upcoming Payments Due */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Payments Due</Text>
            <Ionicons name="calendar" size={20} color="#888" />
          </View>
          <Text style={styles.upcomingPaymentsText}>₹18,200 <Text style={{color:'#e74c3c'}}>due in next 7 days</Text></Text>
        </View>

        {/* Critical Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Critical Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          {/* The low stock alert has been temporarily removed to prevent crashing */}
          <View style={[styles.alertCardItem, {backgroundColor:'#fffbe6'}]}>
            <Ionicons name="warning" size={20} color="#f39c12" />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.alertTitle}><Text style={{color:'#e67e22'}}>⚠️</Text> High Value Order #1234</Text>
              <Text style={styles.alertDetail}>Transaction amount: ₹2,500 - Requires approval</Text>
            </View>
          </View>
          <View style={[styles.alertCardItem, {backgroundColor:'#f9fbe7'}]}>
            <Ionicons name="bar-chart" size={20} color="#27ae60" />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.alertTitle}>Stock Warning: <Text style={{fontWeight:'bold'}}>Herbal Green Tea</Text></Text>
              <Text style={styles.alertDetail}>Low inventory alert - Stock: 15 units left</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#007bff' },
  welcome: { fontSize: 18, color: '#222', marginLeft: 20, marginTop: 8, marginBottom: 12 },
  scrollContent: { paddingBottom: 120 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 },
  metricCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, marginRight: 8, elevation: 2 },
  alertCard: { backgroundColor: '#fffbe6', borderColor: '#f9c66c', borderWidth: 1, shadowColor: '#f9c66c', shadowOpacity: 0.2, shadowRadius: 4 },
  metricTitle: { fontSize: 15, color: '#888', marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  metricValueBold: { fontSize: 22, fontWeight: 'bold', color: '#222', marginTop: 2 },
  metricUp: { color: '#27ae60', fontWeight: 'bold', fontSize: 14 },
  metricValueOrange: { color: '#e67e22', fontWeight: 'bold', fontSize: 18, marginTop: 2 },
  metricCardTall: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, marginRight: 8, elevation: 2, minHeight: 80, justifyContent: 'center' },
  metricValueBlue: { fontSize: 18, color: '#007bff', fontWeight: 'bold' },
  metricValueGreen: { fontSize: 18, color: '#27ae60', fontWeight: 'bold' },
  metricValueOrange: { fontSize: 16, color: '#e67e22', fontWeight: 'bold' },
  metricSubValue: { fontSize: 12, color: '#888', fontWeight: 'normal' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 8 },
  gridCol: { flex: 1 },
  gridBtn: { backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', padding: 16, margin: 4, elevation: 1 },
  gridLabel: { fontSize: 14, color: '#222', marginTop: 6, textAlign: 'center' },
  section: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 20, marginBottom: 16, padding: 16, elevation: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  timeFilter: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  timeFilterText: { color: '#007bff', fontSize: 13 },
  graphPlaceholder: { height: 120, backgroundColor: '#eaf0fa', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  graphText: { color: '#888' },
  wastageGraphPlaceholder: { height: 40, backgroundColor: '#eaf0fa', borderRadius: 4, marginTop: 8 },
  upcomingPaymentsText: { fontSize: 20, color: '#e74c3c', fontWeight: 'bold', marginTop: 8 },
  alertCardItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 10, marginBottom: 8 },
  alertTitle: { fontWeight: 'bold', color: '#e74c3c', fontSize: 15 },
  alertDetail: { fontSize: 13, color: '#333' },
  viewAllLink: { color: '#007bff', fontWeight: 'bold' },
});

