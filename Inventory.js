import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
  const [expanded, setExpanded] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [items, setItems] = useState(INITIAL_ITEMS || []);

  const [form, setForm] = useState({ name: '', quantity: '', unit: '', category: '', expiry: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredItems = (items || []).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm({ name: '', quantity: '', unit: '', category: '', expiry: '' });
    setEditItem(null);
    setAddModal(true);
  };

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

  const handleStockIn = (newlyStockedItems) => {
    let updatedItems = [...items];

    newlyStockedItems.forEach(newItem => {
      const existingItemIndex = updatedItems.findIndex(
        (i) => i.name.toLowerCase() === newItem.name.toLowerCase()
      );

      if (existingItemIndex !== -1) {
        const existingItem = updatedItems[existingItemIndex];
        
        existingItem.quantity += newItem.quantity;
        existingItem.batch = [...existingItem.batch, ...newItem.batch];
        
        existingItem.batch.sort((a, b) => new Date(a.expires) - new Date(b.expires));
        existingItem.expiry = existingItem.batch[0].expires;

        updatedItems[existingItemIndex] = existingItem;
      } else {
        updatedItems.unshift(newItem);
      }
    });

    setItems(updatedItems);
  };

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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Inventory Management</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

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
              </View>
              <Text style={styles.cardCategory}>{item.category}</Text>
              {item.status === 'fresh' && <Text style={styles.statusFresh}>Fresh</Text>}
              {item.status === 'expiring' && <Text style={styles.statusExpiring}>Expires in 7 days</Text>}
              {item.status === 'expired' && <Text style={styles.statusExpired}>Expired</Text>}
              <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(expanded === item.id ? null : item.id)}>
                <Ionicons name={expanded === item.id ? 'chevron-up' : 'chevron-down'} size={20} color="#888" />
              </TouchableOpacity>
              {expanded === item.id && item.batch && item.batch.length > 0 && (
                <View style={styles.batchDetails}>
                  <Text style={styles.batchTitle}>FIFO Batch Details:</Text>
                  {item.batch.map((batch, index) => (
                    <View key={batch.batchNo} style={styles.batchCard}>
                      <Text style={styles.batchNo}>
                        {batch.batchNo} {index === 0 && <Text style={styles.useFirst}>USE FIRST</Text>}
                      </Text>
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

      {tab === 'Stock In' && (
        <StockInSection onAddItems={handleStockIn} />
      )}
      {tab === 'Stock Out' && (
        <View style={styles.tabContent}><Text>Stock Out UI coming soon...</Text></View>
      )}
    </View>
  );
}

function StockInSection({ onAddItems }) {
  const [shift, setShift] = useState('');
  const [items, setItems] = useState([
    { name: '', quantity: '', unit: 'KG', unitPrice: '', batchNo: '', expiry: '' }
  ]);
  const [showDatePickerIdx, setShowDatePickerIdx] = useState(null);
  const [rawMaterial, setRawMaterial] = useState(0);
  const [productionWaste, setProductionWaste] = useState(0);
  const [showQRMessage, setShowQRMessage] = useState(false); // State for QR message

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
  
  const handleSubmit = () => {
    const itemGroups = {};
    const dailySerialCounter = {};

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStringForBatchNo = `${year}${month}${day}`;
    const procuredDate = now.toISOString().slice(0, 10);

    items.forEach(item => {
      if (!item.name) return;

      const prefix = item.name.substring(0, 3).toUpperCase();
      const counterKey = `${prefix}-${dateStringForBatchNo}`;

      dailySerialCounter[counterKey] = (dailySerialCounter[counterKey] || 0) + 1;
      const serialNumber = dailySerialCounter[counterKey].toString().padStart(3, '0');

      const generatedBatchNo = `${counterKey}-${serialNumber}`;

      if (!itemGroups[item.name]) {
        itemGroups[item.name] = {
          totalQuantity: 0,
          unit: item.unit,
          batches: []
        };
      }
      
      itemGroups[item.name].batches.push({
        batchNo: item.batchNo || generatedBatchNo,
        qty: parseFloat(item.quantity) || 0,
        procured: procuredDate,
        expires: item.expiry,
        supplier: '',
        urgent: false
      });
      
      itemGroups[item.name].totalQuantity += parseFloat(item.quantity) || 0;
    });

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

  // Handle QR button press
  const handleScanQR = () => {
    setShowQRMessage(true);
    setTimeout(() => setShowQRMessage(false), 3000); // Hide message after 3 seconds
  };

  return (
    <ScrollView style={{ flex: 1 }}>
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginRight: 4 }}
          onPress={handleScanQR}
        >
          <Text>Scan QR</Text>
          {showQRMessage && <Text style={{ color: '#e74c3c', fontSize: 12 }}>QR is coming soon...</Text>}
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginLeft: 4 }}
        >
          <Text>Manual Entry</Text>
        </TouchableOpacity>
      </View>
      {/* Manual Entry Section with ScrollView for scrolling */}
      <ScrollView style={{ maxHeight: 400 }}> {/* Adjustable maxHeight for scrolling */}
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
      </ScrollView>
      <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Estimated Raw Material ₹{rawMaterial.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>Estimated Production Waste ₹{productionWaste.toFixed(2)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginRight: 4 }}>
          <Text>Scan Bill</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginLeft: 4 }}>
          <Text>Upload Image</Text>
        </TouchableOpacity>
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