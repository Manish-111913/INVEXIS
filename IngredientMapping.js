import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const INVENTORY_INGREDIENTS = [
  { id: '1', name: 'Chicken (Bone-in)', unit: 'kg' },
  { id: '2', name: 'Basmati Rice', unit: 'kg' },
  { id: '3', name: 'Butter', unit: 'g' },
  { id: '4', name: 'Spices', unit: 'g' },
];

const UNITS = ['g', 'kg', 'ml', 'liters', 'each'];

export default function IngredientMapping({ onBack, recipe }) {
  const [ingredients, setIngredients] = useState([
    { id: 1, ingredientId: '', quantity: '', unit: '', cost: 0 }
  ]);
  const [image, setImage] = useState(null);

  // Dummy cost calculation
  const costPerDish = ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0);

  const addIngredient = () => setIngredients([...ingredients, { id: Date.now(), ingredientId: '', quantity: '', unit: '', cost: 0 }]);
  const removeIngredient = (id) => setIngredients(ingredients.filter(ing => ing.id !== id));
  const updateIngredient = (id, field, value) => setIngredients(
    ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing)
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ingredient Mapping</Text>
      </View>

      {/* Recipe Image */}
      <TouchableOpacity style={styles.imageUpload}>
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <>
            <Ionicons name="camera" size={32} color="#888" />
            <Text style={styles.uploadText}>Upload Recipe Image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Ingredients Section */}
      <Text style={styles.sectionTitle}>Ingredients (per 1 serving)</Text>
      {ingredients.map((ing, idx) => (
        <View key={ing.id} style={styles.ingredientRow}>
          {/* Ingredient selection */}
          <TouchableOpacity style={styles.ingredientSelect}>
            <Text style={styles.ingredientName}>
              {INVENTORY_INGREDIENTS.find(i => i.id === ing.ingredientId)?.name || 'Select Ingredient'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
          </TouchableOpacity>
          {/* Quantity */}
          <View style={styles.qtyBox}>
            <TouchableOpacity onPress={() => updateIngredient(ing.id, 'quantity', Math.max(0, (parseFloat(ing.quantity) || 0) - 1).toString())}>
              <Ionicons name="remove-circle" size={22} color="#007bff" />
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              keyboardType="numeric"
              value={ing.quantity}
              onChangeText={val => updateIngredient(ing.id, 'quantity', val)}
              placeholder="Qty"
            />
            <TouchableOpacity onPress={() => updateIngredient(ing.id, 'quantity', ((parseFloat(ing.quantity) || 0) + 1).toString())}>
              <Ionicons name="add-circle" size={22} color="#007bff" />
            </TouchableOpacity>
          </View>
          {/* Unit */}
          <TouchableOpacity style={styles.unitSelect}>
            <Text style={styles.unitText}>{ing.unit || 'Unit'}</Text>
            <MaterialIcons name="arrow-drop-down" size={20} color="#888" />
          </TouchableOpacity>
          {/* Remove */}
          <TouchableOpacity onPress={() => removeIngredient(ing.id)}>
            <Ionicons name="close-circle" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={addIngredient}>
        <Ionicons name="add" size={20} color="#007bff" />
        <Text style={styles.addBtnText}>Add More Items</Text>
      </TouchableOpacity>

      {/* Cost per dish */}
      <Text style={styles.costLabel}>Calculated Cost per Dish: <Text style={styles.costValue}>₹{costPerDish.toFixed(2)}</Text></Text>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmBtn}>
        <Text style={styles.confirmBtnText}>Confirm and Continue</Text>
      </TouchableOpacity>

      {/* Guidance */}
      <Text style={styles.guidance}>
        Quantities are for one standard serving. Ingredient selection is linked to your inventory.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginLeft: 12 },
  imageUpload: { alignItems: 'center', marginBottom: 16, padding: 20, backgroundColor: '#eaf0fa', borderRadius: 12 },
  recipeImage: { width: 100, height: 100, borderRadius: 12 },
  uploadText: { color: '#888', marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#007bff', marginBottom: 8 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10 },
  ingredientSelect: { flex: 2, flexDirection: 'row', alignItems: 'center' },
  ingredientName: { color: '#222', fontSize: 15, marginRight: 4 },
  qtyBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  qtyInput: { width: 40, borderBottomWidth: 1, borderColor: '#ccc', textAlign: 'center', fontSize: 15, marginHorizontal: 4 },
  unitSelect: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  unitText: { fontSize: 15, color: '#555' },
  addBtn: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  addBtnText: { color: '#007bff', marginLeft: 6, fontWeight: 'bold' },
  costLabel: { fontSize: 15, color: '#333', marginTop: 12, marginBottom: 4 },
  costValue: { fontWeight: 'bold', color: '#007bff' },
  confirmBtn: { backgroundColor: '#007bff', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 18 },
  confirmBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  guidance: { fontSize: 13, color: '#888', marginTop: 14, textAlign: 'center' },
});
