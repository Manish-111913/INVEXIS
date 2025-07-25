import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const TABS = ['Overview', 'Stock In', 'Stock Out'];

const INITIAL_ITEMS = [
  { id: '1', name: 'Tomatoes', quantity: 2.5, unit: 'kg', category: 'Vegetables', status: 'fresh', expiry: '2025-01-25', batch: [
    { batchNo: 'TOM-250123-001', qty: 1.5, procured: '2025-01-23', expires: '2025-01-25', supplier: 'Fresh Farm Co.', urgent: true },
    { batchNo: 'TOM-250123-002', qty: 1, procured: '2025-01-23', expires: '2025-01-26', supplier: 'Green Valley', urgent: false },
  ] },
  { id: '2', name: 'Chicken Breast', quantity: 15, unit: 'kg', category: 'Meat', status: 'expiring', expiry: '2025-01-30', batch: [] },
  { id: '3', name: 'Olive Oil', quantity: 5, unit: 'L', category: 'Oils', status: 'fresh', expiry: '2025-04-01', batch: [] },
  { id: '4', name: 'Curry Leaves', quantity: 0.2, unit: 'kg', category: 'Herbs', status: 'expired', expiry: '2025-01-20', batch: [
    { batchNo: 'CUR-250123-001', qty: 0.2, procured: '2025-01-10', expires: '2025-01-20', supplier: 'Herb Co.', urgent: true },
  ] },
];

export default function Inventory({ onBack }) {
  const [tab, setTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null); // id of expanded card
  const [editModal, setEditModal] = useState(false); // REMOVE
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null); // REMOVE
  const [items, setItems] = useState(INITIAL_ITEMS || []);

  // Controlled form fields
  const [form, setForm] = useState({ name: '', quantity: '', unit: '', category: '', expiry: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filtered inventory for search
  const filteredItems = (items || []).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Open add modal
  const openAddModal = () => {
    setForm({ name: '', quantity: '', unit: '', category: '', expiry: '' });
    setEditItem(null);
    setAddModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category,
      expiry: item.expiry,
    });
    setEditItem(item);
    setEditModal(true);
  };

  // Save item (add or edit)
  const saveItem = () => {
  if (!form.name || !form.quantity || !form.unit || !form.category || !form.expiry) return;

  const batchEntry = {
    batchNo: `${form.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
    qty: parseFloat(form.quantity),
    procured: new Date().toISOString().split('T')[0],
    expires: form.expiry,
    supplier: 'Unknown',
    urgent: false
  };

  const existingItemIndex = items.findIndex(i => i.name.toLowerCase() === form.name.toLowerCase());

  if (existingItemIndex !== -1) {
    const updatedItems = [...items];
    const existingItem = updatedItems[existingItemIndex];

    existingItem.quantity += parseFloat(form.quantity);
    existingItem.batch.push(batchEntry);

    updatedItems[existingItemIndex] = existingItem;
    setItems(updatedItems);
  } else {
    const newItem = {
      id: (Date.now() + Math.random()).toString(),
      name: form.name,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      category: form.category,
      expiry: form.expiry,
      status: 'fresh',
      batch: [batchEntry]
    };

    setItems([newItem, ...items]);
  }

  setAddModal(false);
  setForm({ name: '', quantity: '', unit: '', category: '', expiry: '' });
};



// ... inside your 'Inventory' component, after the saveItem function ...

const handleStockIn = (newlyStockedItems) => {
  // Create a copy of the current items to avoid direct mutation
  let updatedItems = [...items]; 

  newlyStockedItems.forEach(newItem => {
    // Find if an item with the same name already exists in our main list
    const existingItemIndex = updatedItems.findIndex(
      (i) => i.name.toLowerCase() === newItem.name.toLowerCase()
    );

    if (existingItemIndex !== -1) {
      // --- ITEM EXISTS: MERGE IT ---
      const existingItem = updatedItems[existingItemIndex];
      
      // Add the new quantity to the existing total
      existingItem.quantity += newItem.quantity;
      
      // Add the new batches to the existing batch list
      existingItem.batch = [...existingItem.batch, ...newItem.batch];
      
      // Sort all batches by expiry date to maintain FIFO
      existingItem.batch.sort((a, b) => new Date(a.expires) - new Date(b.expires));
      
      // Update the main expiry to be the earliest one
      existingItem.expiry = existingItem.batch[0].expires;

      // Replace the old item with the updated one
      updatedItems[existingItemIndex] = existingItem;

    } else {
      // --- ITEM IS NEW: ADD IT ---
      // If it doesn't exist, just add it to the list
      updatedItems.unshift(newItem); // or .push(newItem)
    }
  });

  // Set the final, merged list as the new state
  setItems(updatedItems);
};






  // Modal for add/edit
  const renderEditModal = () => (
    <Modal visible={editModal || addModal} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{addModal ? 'Add Item' : 'Edit Item'}</Text>
          <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <TextInput style={styles.input} placeholder="Quantity" value={form.quantity} onChangeText={v => setForm(f => ({ ...f, quantity: v }))} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Unit" value={form.unit} onChangeText={v => setForm(f => ({ ...f, unit: v }))} />
          <TextInput style={styles.input} placeholder="Category" value={form.category} onChangeText={v => setForm(f => ({ ...f, category: v }))} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Expiry Date"
              value={form.expiry}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.expiry ? new Date(form.expiry) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setForm(f => ({ ...f, expiry: selectedDate.toISOString().slice(0, 10) }));
                }
              }}
            />
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <TouchableOpacity onPress={() => { setEditModal(false); setAddModal(false); setEditItem(null); }} style={styles.cancelBtn}>
              <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Inventory Management</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#007bff" />
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

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search items..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity>
          <Feather name="filter" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Overview Tab: Grid of Cards */}
      {tab === 'Overview' && (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardQty}>{item.quantity} {item.unit}</Text>
                </View>
                {/* Removed Edit Button */}
              </View>
              <Text style={styles.cardCategory}>{item.category}</Text>
              {/* Status/Expiry */}
              {item.status === 'fresh' && <Text style={styles.statusFresh}>Fresh</Text>}
              {item.status === 'expiring' && <Text style={styles.statusExpiring}>Expires in 7 days</Text>}
              {item.status === 'expired' && <Text style={styles.statusExpired}>Expired</Text>}
              {/* Dropdown/Expand */}
              <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(expanded === item.id ? null : item.id)}>
                <Ionicons name={expanded === item.id ? 'chevron-up' : 'chevron-down'} size={20} color="#888" />
              </TouchableOpacity>
              {/* Expanded batch details */}
              {expanded === item.id && item.batch && item.batch.length > 0 && (
                <View style={styles.batchDetails}>
                  <Text style={styles.batchTitle}>FIFO Batch Details:</Text>
                  {item.batch.map(batch => (
                    <View key={batch.batchNo} style={styles.batchCard}>
                      <Text style={styles.batchNo}>{batch.batchNo} {batch.urgent && <Text style={styles.useFirst}>USE FIRST</Text>}</Text>
                      <Text style={styles.batchQty}>{batch.qty} {item.unit}</Text>
                      <Text style={styles.batchInfo}>Procured: {batch.procured}</Text>
                      <Text style={styles.batchInfo}>Expires: {batch.expires}</Text>
                      <Text style={styles.batchInfo}>Supplier: {batch.supplier}</Text>
                      {batch.urgent && <Text style={styles.urgent}>Urgent</Text>}
                      <TouchableOpacity style={styles.deleteBatchBtn}>
                        <Ionicons name="trash" size={16} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.quickReportsBtn}>
                <Feather name="file-text" size={18} color="#222" />
                <Text style={styles.quickReportsText}>Quick Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
              {renderEditModal()}
            </View>
          }
        />
      )}

      {/* Stock In/Stock Out tabs remain unchanged for now */}
      {tab === 'Stock In' && (
  <StockInSection onAddItems={handleStockIn} />
)}
      {tab === 'Stock Out' && (
        <View style={styles.tabContent}><Text>Stock Out UI coming soon...</Text></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingTop: 50, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  tabsRow: { flexDirection: 'row', marginBottom: 8, marginHorizontal: 4 },
  tabBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  tabBtnActive: { backgroundColor: '#007bff' },
  tabText: { color: '#555', fontSize: 15 },
  tabTextActive: { color: '#fff' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  searchBar: { flex: 1, fontSize: 16, paddingVertical: 8, backgroundColor: 'transparent' },
  gridContent: { paddingBottom: 120, paddingHorizontal: 2 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, margin: 6, elevation: 1, borderWidth: 1, borderColor: '#eee', position: 'relative', minWidth: 0 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  cardQty: { fontSize: 15, color: '#222', fontWeight: 'bold', marginBottom: 2 },
  cardCategory: { color: '#888', fontSize: 13, marginBottom: 2 },
  statusFresh: { color: '#27ae60', fontWeight: 'bold', fontSize: 13 },
  statusExpiring: { color: '#e67e22', fontWeight: 'bold', fontSize: 13 },
  statusExpired: { color: '#e74c3c', fontWeight: 'bold', fontSize: 13 },
  expandBtn: { position: 'absolute', top: 8, right: 8, padding: 4 },
  batchDetails: { marginTop: 10, backgroundColor: '#f8f8f8', borderRadius: 8, padding: 8 },
  batchTitle: { fontWeight: 'bold', color: '#222', marginBottom: 4 },
  batchCard: { backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 6, borderWidth: 1, borderColor: '#eee', position: 'relative' },
  batchNo: { fontWeight: 'bold', color: '#222' },
  useFirst: { color: '#007bff', fontWeight: 'bold', fontSize: 12, marginLeft: 6 },
  batchQty: { color: '#222', fontWeight: 'bold' },
  batchInfo: { color: '#888', fontSize: 12 },
  urgent: { color: '#e74c3c', fontWeight: 'bold', fontSize: 12 },
  deleteBatchBtn: { position: 'absolute', top: 6, right: 6 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20, paddingHorizontal: 8 },
  quickReportsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  quickReportsText: { color: '#222', fontWeight: 'bold', marginLeft: 8 },
  addBtn: { backgroundColor: '#007bff', borderRadius: 50, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  input: { backgroundColor: '#f7f7f7', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cancelBtn: { padding: 10, marginRight: 10 },
  saveBtn: { backgroundColor: '#007bff', borderRadius: 8, padding: 10, paddingHorizontal: 18 },
  tabContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

function StockInSection({ onAddItems }) {
  const [activeTab, setActiveTab] = useState('Scan Bill'); // NEW: tab state
  const [shift, setShift] = useState('');
  const [items, setItems] = useState([
    { name: '', quantity: '', unit: 'KG', unitPrice: '', batchNo: '', expiry: '' }
  ]);
  const [showDatePickerIdx, setShowDatePickerIdx] = useState(null);
  const [rawMaterial, setRawMaterial] = useState(0);
  const [productionWaste, setProductionWaste] = useState(0);
  const [batchSerials, setBatchSerials] = useState({});

  // --- Scan Bill State ---
  const [scanStep, setScanStep] = useState('initial'); // 'initial' | 'processing' | 'result'
  const [scannedImage, setScannedImage] = useState(null); // uri or require
  const [supplier, setSupplier] = useState('');
  const [billDate, setBillDate] = useState('');
  const [showBillDatePicker, setShowBillDatePicker] = useState(false);
  const [scanItems, setScanItems] = useState([]); // [{name, quantity, unit, unitPrice, matched, suggestions}]
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemModalIdx, setItemModalIdx] = useState(null);

  // Simulated database
  const DB_ITEMS = ['Tomatoes', 'Mutton', 'Organic Bananas', 'Potatoes', 'Onions', 'Chicken Breast'];

  // Image picker logic
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setScanStep('processing');
      setTimeout(() => {
        setScannedImage(result.assets[0].uri);
        // Simulate OCR: 1 matched, 1 unmatched
        setScanItems([
          { name: 'Organic Bananas', quantity: '50', unit: 'KG', unitPrice: '2.99', matched: true, suggestions: [] },
          { name: 'Tomato', quantity: '55', unit: 'KG', unitPrice: '2.99', matched: false, suggestions: ['Tomatoes', 'Cherry Tomatoes', 'Tomato Paste'] },
        ]);
        setScanStep('result');
        setSupplier('Vegetables');
        setBillDate(new Date().toISOString().slice(0, 10));
      }, 2000);
    }
  };

  // Camera logic (simulate as image picker for now)
  const handleCameraPick = handleImagePick;

  // Item modal select
  const openItemModal = idx => { setItemModalIdx(idx); setShowItemModal(true); };
  const selectItemSuggestion = (idx, suggestion) => {
    setScanItems(items => items.map((item, i) => i === idx ? { ...item, name: suggestion, matched: true, suggestions: [] } : item));
    setShowItemModal(false);
  };

  // Add/Remove/Edit items
  const addScanItem = () => setScanItems([...scanItems, { name: '', quantity: '', unit: 'KG', unitPrice: '', matched: true, suggestions: [] }]);
  const removeScanItem = idx => setScanItems(scanItems.filter((_, i) => i !== idx));
  const updateScanItem = (idx, field, value) => setScanItems(scanItems.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  // Total cost
  const totalCost = scanItems.reduce((sum, i) => sum + (parseFloat(i.quantity) || 0) * (parseFloat(i.unitPrice) || 0), 0);

  const fieldConfig = [
    { key: 'name', placeholder: 'Item Name', keyboardType: 'default' },
    { key: 'quantity', placeholder: 'Quantity', keyboardType: 'numeric' },
    { key: 'unit', placeholder: 'Unit', keyboardType: 'default' },
    { key: 'unitPrice', placeholder: 'Unit Price', keyboardType: 'numeric' },
    { key: 'batchNo', placeholder: 'Batch No', keyboardType: 'default' },
    { key: 'expiry', placeholder: 'Expiry Date', keyboardType: 'default' },
  ];
  
  
  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
    recalcEstimates(updated);
  };
  
  const addMoreItems = () => {
    setItems([...items, { name: '', quantity: '', unit: 'KG', unitPrice: '', batchNo: '', expiry: '' }]);
  };
  
  const recalcEstimates = (itemsList) => {
    let total = 0;
    itemsList.forEach(i => {
      const qty = parseFloat(i.quantity) || 0;
      const price = parseFloat(i.unitPrice) || 0;
      total += qty * price;
    });
    setRawMaterial(total);
    setProductionWaste(total); // Adjust as needed
  };
  
 // In your StockInSection component
const handleSubmit = () => {
  const itemGroups = {};
  // This object will track the serial number for each item type during this submission
  const dailySerialCounter = {};

  // Get current date components once for consistency
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // e.g., '25'
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // e.g., '07'
  const day = now.getDate().toString().padStart(2, '0'); // e.g., '25'
  const dateStringForBatchNo = `${year}${month}${day}`; // '250725'
  const procuredDate = now.toISOString().slice(0, 10); // '2025-07-25'

  items.forEach(item => {
    if (!item.name) return; // Skip empty item rows

    // 1. Generate the three-letter prefix from the item name
    const prefix = item.name.substring(0, 3).toUpperCase();
    
    // Create a unique key for the counter (e.g., 'TOM-250725')
    const counterKey = `${prefix}-${dateStringForBatchNo}`;

    // 2. Increment the serial number for this item type
    dailySerialCounter[counterKey] = (dailySerialCounter[counterKey] || 0) + 1;
    const serialNumber = dailySerialCounter[counterKey].toString().padStart(3, '0'); // '001', '002', etc.

    // 3. Combine all parts into the final batch number
    const generatedBatchNo = `${counterKey}-${serialNumber}`; // e.g., 'TOM-250725-001'

    // Group items by name (this logic remains the same)
    if (!itemGroups[item.name]) {
      itemGroups[item.name] = {
        totalQuantity: 0,
        unit: item.unit,
        batches: []
      };
    }
    
    // Add batch information, using the generated batch number
    itemGroups[item.name].batches.push({
      // If user manually types a batch number, use it. Otherwise, use our generated one.
      batchNo: item.batchNo || generatedBatchNo,
      qty: parseFloat(item.quantity) || 0,
      procured: procuredDate,
      expires: item.expiry,
      supplier: '', // This can be a field in your form
      urgent: false
    });
    
    // Update total quantity
    itemGroups[item.name].totalQuantity += parseFloat(item.quantity) || 0;
  });

  // This part of the function remains completely unchanged
  const finalItems = [];
  Object.entries(itemGroups).forEach(([name, data]) => {
    const sortedBatches = data.batches.sort((a, b) => new Date(a.expires) - new Date(b.expires));
    finalItems.push({
      id: (Date.now() + Math.random()).toString(),
      name: name,
      quantity: data.totalQuantity,
      unit: data.unit,
      category: '',
      status: 'fresh',
      expiry: sortedBatches.length > 0 ? sortedBatches[0].expires : '',
      batch: sortedBatches
    });
  });

  onAddItems(finalItems);
  setItems([{ name: '', quantity: '', unit: 'KG', unitPrice: '', batchNo: '', expiry: '' }]);
  setRawMaterial(0);
  setProductionWaste(0);
  setShift('');
};



  // --- NEW: Scan Bill UI ---
  const renderScanBillUI = () => {
    if (scanStep === 'processing') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', elevation: 4 }}>
            <View style={{ marginBottom: 16 }}>
              <MaterialIcons name="autorenew" size={40} color="#ff8800" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222', marginBottom: 8 }}>Processing Bill...</Text>
            <Text style={{ color: '#888', fontSize: 15 }}>Reading text and matching items</Text>
          </View>
        </View>
      );
    }
    if (scanStep === 'result') {
      return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', marginBottom: 18, marginHorizontal: 4 }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Scan Bill' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
              onPress={() => setActiveTab('Scan Bill')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="photo-camera" size={20} color={activeTab === 'Scan Bill' ? '#ff8800' : '#888'} style={{ marginRight: 6 }} />
                <Text style={{ color: activeTab === 'Scan Bill' ? '#ff8800' : '#888', fontWeight: 'bold', fontSize: 16 }}>Scan Bill</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Manual Entry' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
              onPress={() => setActiveTab('Manual Entry')}
            >
              <Text style={{ color: activeTab === 'Manual Entry' ? '#222' : '#888', fontWeight: 'bold', fontSize: 16 }}>Manual Entry</Text>
            </TouchableOpacity>
          </View>
          {/* Image preview */}
          <View style={{ backgroundColor: '#800', borderRadius: 16, height: 140, margin: 16, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {scannedImage && (
              <TouchableOpacity style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="search" size={16} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 12 }}> Tap to zoom</Text>
                </View>
                <Image source={{ uri: scannedImage }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 16 }} />
              </TouchableOpacity>
            )}
          </View>
          {/* Supplier and Bill Date */}
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Supplier</Text>
            <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 10 }}>
              <Picker
                selectedValue={supplier}
                onValueChange={setSupplier}
              >
                <Picker.Item label="Vegetables" value="Vegetables" />
                <Picker.Item label="Groceries" value="Groceries" />
                <Picker.Item label="Dairy" value="Dairy" />
                <Picker.Item label="Meat" value="Meat" />
              </Picker>
            </View>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Bill Date</Text>
            <TouchableOpacity onPress={() => setShowBillDatePicker(true)}>
              <TextInput
                style={{ backgroundColor: '#f7f7f7', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 10, borderWidth: 1, borderColor: '#eee' }}
                placeholder="YYYY-MM-DD"
                value={billDate}
                editable={false}
              />
            </TouchableOpacity>
            {showBillDatePicker && (
              <DateTimePicker
                value={billDate ? new Date(billDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowBillDatePicker(false);
                  if (selectedDate) {
                    setBillDate(selectedDate.toISOString().slice(0, 10));
                  }
                }}
              />
            )}
          </View>
          {/* Items Section */}
          <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Items</Text>
            {scanItems.map((item, idx) => {
              // Generate batch number for display
              const today = getTodayStr();
              const prefix = item.name.substring(0, 3).toUpperCase();
              let serial = 1;
              if (batchSerials[today] && batchSerials[today][prefix]) serial = batchSerials[today][prefix] + idx;
              const batchNo = generateBatchNo(item.name, today, serial);
              return (
                <View key={idx} style={{ backgroundColor: item.matched ? '#e6f7e6' : '#fff7e6', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: item.matched ? '#b2e6b2' : '#ffd699', position: 'relative' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    {item.matched ? (
                      <Feather name="check" size={18} color="#27ae60" style={{ marginRight: 6 }} />
                    ) : (
                      <Feather name="alert-triangle" size={18} color="#e67e22" style={{ marginRight: 6 }} />
                    )}
                    <TextInput
                      style={{ flex: 1, fontWeight: 'bold', fontSize: 16, color: '#222', backgroundColor: 'transparent' }}
                      value={item.name}
                      onChangeText={v => updateScanItem(idx, 'name', v)}
                      editable={item.matched}
                    />
                    {!item.matched && (
                      <TouchableOpacity onPress={() => openItemModal(idx)} style={{ marginLeft: 8 }}>
                        <Feather name="chevron-down" size={18} color="#e67e22" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => removeScanItem(idx)} style={{ marginLeft: 8 }}>
                      <Feather name="x" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <TextInput
                      style={{ flex: 1, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginRight: 6, padding: 6 }}
                      placeholder="Quantity"
                      value={item.quantity}
                      onChangeText={v => updateScanItem(idx, 'quantity', v)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={{ width: 60, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginRight: 6, padding: 6 }}
                      placeholder="Unit"
                      value={item.unit}
                      onChangeText={v => updateScanItem(idx, 'unit', v)}
                    />
                    <TextInput
                      style={{ flex: 1, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#eee', padding: 6 }}
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChangeText={v => updateScanItem(idx, 'unitPrice', v)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 13, color: '#888', marginRight: 8 }}>Batch No:</Text>
                    <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13 }}>{batchNo}</Text>
                  </View>
                </View>
              );
            })}
            <TouchableOpacity onPress={addScanItem} style={{ backgroundColor: '#fff7e6', borderRadius: 12, borderWidth: 1, borderColor: '#ffd699', padding: 14, alignItems: 'center', marginBottom: 10 }}>
              <Feather name="plus" size={18} color="#e67e22" />
              <Text style={{ color: '#e67e22', fontWeight: 'bold', marginTop: 4 }}>+ Add More Items</Text>
            </TouchableOpacity>
          </View>
          {/* Total Cost */}
          <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginHorizontal: 16, marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Total Cost of Raw Materials <Text style={{ color: '#e67e22' }}>₹{totalCost.toFixed(2)}</Text></Text>
          </View>
          {/* Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 24 }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#eee', borderRadius: 8, padding: 14, alignItems: 'center', marginRight: 4 }}>
              <Text>Save as Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#ff8800', borderRadius: 8, padding: 14, alignItems: 'center', marginLeft: 4 }} onPress={handleScanBillSubmit}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
          </View>
          {/* Item Modal for unmatched items */}
          {showItemModal && itemModalIdx !== null && (
            <Modal visible transparent animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '80%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, textAlign: 'center' }}>Select Item</Text>
                  {scanItems[itemModalIdx].suggestions.map((s, i) => (
                    <TouchableOpacity key={i} onPress={() => selectItemSuggestion(itemModalIdx, s)} style={{ paddingVertical: 12, borderBottomWidth: i !== scanItems[itemModalIdx].suggestions.length - 1 ? 1 : 0, borderColor: '#eee' }}>
                      <Text style={{ fontSize: 16 }}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setShowItemModal(false)} style={{ marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>
      );
    }
    // initial step
    return (
      <View style={{ flex: 1, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 18, marginHorizontal: 4 }}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Scan Bill' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
            onPress={() => setActiveTab('Scan Bill')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="photo-camera" size={20} color={activeTab === 'Scan Bill' ? '#ff8800' : '#888'} style={{ marginRight: 6 }} />
              <Text style={{ color: activeTab === 'Scan Bill' ? '#ff8800' : '#888', fontWeight: 'bold', fontSize: 16 }}>Scan Bill</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Manual Entry' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
            onPress={() => setActiveTab('Manual Entry')}
          >
            <Text style={{ color: activeTab === 'Manual Entry' ? '#222' : '#888', fontWeight: 'bold', fontSize: 16 }}>Manual Entry</Text>
          </TouchableOpacity>
        </View>
        {/* Scan Bill Content */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 18, borderWidth: 1, borderColor: '#ff8800', marginHorizontal: 8 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleCameraPick}>
            <MaterialIcons name="photo-camera" size={40} color="#ff8800" />
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222', marginTop: 8 }}>Scan Bill</Text>
            <Text style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Take a photo of your bill</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#007bff', marginHorizontal: 8 }}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleImagePick}>
            <Feather name="upload-cloud" size={40} color="#007bff" />
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222', marginTop: 8 }}>Upload Image</Text>
            <Text style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Choose from gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // --- END NEW ---

  // --- UI RENDER ---
  if (activeTab === 'Scan Bill') {
    return renderScanBillUI();
  }

  // Manual Entry UI (scrollable, no scan/upload buttons)
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 64 }}>
      <View style={{ flexDirection: 'row', marginBottom: 18, marginHorizontal: 4 }}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Scan Bill' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
          onPress={() => setActiveTab('Scan Bill')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="photo-camera" size={20} color={activeTab === 'Scan Bill' ? '#ff8800' : '#888'} style={{ marginRight: 6 }} />
            <Text style={{ color: activeTab === 'Scan Bill' ? '#ff8800' : '#888', fontWeight: 'bold', fontSize: 16 }}>Scan Bill</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: activeTab === 'Manual Entry' ? '#ff8800' : 'transparent', paddingVertical: 10 }}
          onPress={() => setActiveTab('Manual Entry')}
        >
          <Text style={{ color: activeTab === 'Manual Entry' ? '#222' : '#888', fontWeight: 'bold', fontSize: 16 }}>Manual Entry</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Shift</Text>
        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 10 }}>
          <Picker
            selectedValue={shift}
            onValueChange={setShift}
          >
            <Picker.Item label="Select Shift" value="" />
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Evening" value="Evening" />
            <Picker.Item label="Night" value="Night" />
          </Picker>
        </View>
      </View>
      <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Items</Text>
      {items.map((item, idx) => (
        <View key={idx} style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 }}>
          <TextInput placeholder="Item Name" value={item.name} onChangeText={v => handleItemChange(idx, 'name', v)} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 6 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <TextInput placeholder="Quantity" value={item.quantity} onChangeText={v => handleItemChange(idx, 'quantity', v)} keyboardType="numeric" style={{ flex: 1, borderBottomWidth: 1, borderColor: '#eee', marginRight: 6 }} />
            <TextInput placeholder="Unit" value={item.unit} onChangeText={v => handleItemChange(idx, 'unit', v)} style={{ width: 60, borderBottomWidth: 1, borderColor: '#eee', marginRight: 6 }} />
            <TextInput placeholder="Unit Price" value={item.unitPrice} onChangeText={v => handleItemChange(idx, 'unitPrice', v)} keyboardType="numeric" style={{ flex: 1, borderBottomWidth: 1, borderColor: '#eee' }} />
          </View>
          <TextInput placeholder="Batch Number" value={item.batchNo} onChangeText={v => handleItemChange(idx, 'batchNo', v)} style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 6 }} />
          <TouchableOpacity onPress={() => setShowDatePickerIdx(idx)}>
            <TextInput 
              placeholder="Expiry Date (YYYY-MM-DD)" 
              value={item.expiry} 
              editable={false}
              style={{ borderBottomWidth: 1, borderColor: '#eee', marginBottom: 6 }} 
            />
          </TouchableOpacity>
          {showDatePickerIdx === idx && (
            <DateTimePicker
              value={item.expiry ? new Date(item.expiry) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePickerIdx(null);
                if (selectedDate) {
                  handleItemChange(idx, 'expiry', selectedDate.toISOString().slice(0, 10));
                }
              }}
            />
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addMoreItems} style={{ backgroundColor: '#eee', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: '#007bff', fontWeight: 'bold' }}>+ Add More Items</Text>
      </TouchableOpacity>
      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Estimated Raw Material ₹{rawMaterial.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>Estimated Production Waste ₹{productionWaste.toFixed(2)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#eee', borderRadius: 8, padding: 14, alignItems: 'center', marginRight: 4 }}>
          <Text>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#222', borderRadius: 8, padding: 14, alignItems: 'center', marginLeft: 4 }} onPress={handleSubmit}>
          <Text style={{ color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Helper: get today's date string YYMMDD
const getTodayStr = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const generateBatchNo = (name, date, serial) => {
  const prefix = name.substring(0, 3).toUpperCase();
  return `${prefix}-${date}-${serial.toString().padStart(4, '0')}`;
};

const handleScanBillSubmit = () => {
  const today = getTodayStr();
  let serials = { ...batchSerials[today] } || {};
  let batchNumbers = [];
  let finalItems = [];
  let duplicate = false;
  let usedSerials = {};

  scanItems.forEach((item, idx) => {
    const prefix = item.name.substring(0, 3).toUpperCase();
    if (!serials[prefix]) serials[prefix] = 1;
    else serials[prefix] += 1;
    if (serials[prefix] > 9999) serials[prefix] = 1;
    let batchNo = generateBatchNo(item.name, today, serials[prefix]);
    while (batchNumbers.includes(batchNo) || usedSerials[batchNo]) {
      serials[prefix] += 1;
      if (serials[prefix] > 9999) serials[prefix] = 1;
      batchNo = generateBatchNo(item.name, today, serials[prefix]);
      if (Object.keys(usedSerials).length > 9999) {
        duplicate = true;
        return;
      }
    }
    if (batchNumbers.includes(batchNo)) {
      duplicate = true;
      return;
    }
    usedSerials[batchNo] = true;
    batchNumbers.push(batchNo);
    finalItems.push({
      id: (Date.now() + Math.random()).toString(),
      name: item.name,
      quantity: parseFloat(item.quantity) || 0,
      unit: item.unit,
      category: '',
      expiry: billDate,
      status: 'fresh',
      batch: [{
        batchNo,
        qty: parseFloat(item.quantity) || 0,
        procured: billDate,
        expires: billDate,
        supplier,
        urgent: false
      }]
    });
  });
  if (duplicate) {
    Alert.alert('Duplicate Batch Number', 'This batch number is already present.');
    return;
  }
  // Add to Overview
  onAddItems(finalItems);
  // Update batchSerials for the day
  setBatchSerials(prev => ({ ...prev, [today]: serials }));
  setScanStep('initial');
  setScanItems([]);
  setScannedImage(null);
};
