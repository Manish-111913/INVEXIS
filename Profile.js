import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Profile({ onBack }) {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileBox}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Prem Kumar</Text>
        <Text style={styles.email}>prem.kumar@email.com</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingRow}>
          <MaterialIcons name="lock" size={22} color="#007bff" />
          <Text style={styles.settingLabel}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="language" size={22} color="#007bff" />
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </TouchableOpacity>
        <View style={styles.settingRow}>
          <Ionicons name="notifications" size={22} color="#007bff" />
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? "#007bff" : "#ccc"}
          />
        </View>
      </View>

      {/* Subscription/Plan Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.planRow}>
          <Text style={styles.planLabel}>Current Plan:</Text>
          <Text style={styles.planValue}>Starter</Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>

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
  profileBox: { alignItems: 'center', marginVertical: 18 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  email: { color: '#888', fontSize: 15, marginBottom: 4 },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
  settingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  settingLabel: { marginLeft: 10, fontSize: 15, color: '#333', flex: 1 },
  settingValue: { color: '#888', fontSize: 15 },
  planRow: { flexDirection: 'row', alignItems: 'center' },
  planLabel: { color: '#333', fontSize: 15 },
  planValue: { color: '#007bff', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  upgradeBtn: { backgroundColor: '#007bff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, marginLeft: 16 },
  upgradeBtnText: { color: '#fff', fontWeight: 'bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e74c3c', padding: 14, borderRadius: 8, justifyContent: 'center', marginTop: 10 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', marginTop: 10 },
});
