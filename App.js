import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import BusinessSetup from './BusinessSetup';
import Dashboard from './Dashboard';
import RecipeList from './RecipeList';
import IngredientMapping from './IngredientMapping';
import Inventory from './Inventory';
import VendorBillScan from './VendorBillScan';
import SalesManagement from './SalesManagement';
import VendorManagement from './VendorManagement';
import Reports from './Reports';
import Profile from './Profile';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import SignUpScreen from './SignUpScreen';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { INITIAL_ITEMS } from './Inventory';

export default function App() {
  const [stage, setStage] = useState('login');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Main content rendering
  let mainContent = null;
  if (stage === 'login') {
    mainContent = (
      <LoginScreen
        onLogin={() => setStage('setup')}
        onForgotPassword={() => setStage('forgotPassword')}
        onSignUp={() => setStage('signUp')}
      />
    );
  } else if (stage === 'setup') {
    mainContent = <BusinessSetup onFinish={() => setStage('dashboard')} />;
  } else if (stage === 'dashboard') {
    mainContent = (
      <Dashboard items={INITIAL_ITEMS} onGoToRecipes={() => setStage('recipes')} onGoToInventory={() => setStage('inventory')} onGoToVendorBillScan={() => setStage('vendorBillScan')}
        onGoToSalesManagement={() => setStage('salesManagement')}
        onGoToVendorManagement={() => setStage('vendorManagement')}
        onGoToReports={() => setStage('reports')}
        onGoToProfile={() => setStage('profile')}
      />
    );
  } else if (stage === 'recipes') {
    if (selectedRecipe) {
      mainContent = (
        <IngredientMapping
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipe(null)}
        />
      );
    } else {
      mainContent = (
        <RecipeList
          onSelectRecipe={setSelectedRecipe}
          onBack={() => setStage('dashboard')}
          onScanMenu={() => alert('OCR Scan flow here')}
        />
      );
    }
  } else if (stage === 'inventory') {
    mainContent = <Inventory onBack={() => setStage('dashboard')} />;
  } else if (stage === 'vendorBillScan') {
    mainContent = <VendorBillScan onBack={() => setStage('dashboard')} />;
  } else if (stage === 'salesManagement') {
    mainContent = <SalesManagement onBack={() => setStage('dashboard')} />;
  } else if (stage === 'vendorManagement') {
    mainContent = <VendorManagement onBack={() => setStage('dashboard')} />;
  } else if (stage === 'reports') {
    mainContent = <Reports onBack={() => setStage('dashboard')} />;
  } else if (stage === 'profile') {
    mainContent = <Profile onBack={() => setStage('dashboard')} />;
  } else if (stage === 'forgotPassword') {
    mainContent = <ForgotPasswordScreen onBack={() => setStage('login')} />;
  } else if (stage === 'signUp') {
    mainContent = (
      <SignUpScreen
        onBack={() => setStage('login')}
        onSignUp={() => setStage('setup')}
      />
    );
  }

  // Footer should not show on login/setup/forgot/signup
  const showFooter = !['login', 'setup', 'forgotPassword', 'signUp'].includes(stage);

  return (
    <View style={{ flex: 1 }}>
      {mainContent}
      {showFooter && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setStage('dashboard')}>
            <Ionicons name="home" size={24} color={stage === 'dashboard' ? '#007bff' : '#888'} />
            <Text style={[styles.navLabel, stage === 'dashboard' && styles.activeLabel]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setStage('inventory')}>
            <Feather name="box" size={24} color={stage === 'inventory' ? '#007bff' : '#888'} />
            <Text style={[styles.navLabel, stage === 'inventory' && styles.activeLabel]}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setStage('reports')}>
            <MaterialIcons name="bar-chart" size={24} color={stage === 'reports' ? '#007bff' : '#888'} />
            <Text style={[styles.navLabel, stage === 'reports' && styles.activeLabel]}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setStage('vendorManagement')}>
            <MaterialIcons name="people" size={24} color={stage === 'vendorManagement' ? '#007bff' : '#888'} />
            <Text style={[styles.navLabel, stage === 'vendorManagement' && styles.activeLabel]}>Vendors</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', zIndex: 10 },
  navItem: { alignItems: 'center', flex: 1 },
  navLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  activeLabel: { color: '#007bff', fontWeight: 'bold' },
});
