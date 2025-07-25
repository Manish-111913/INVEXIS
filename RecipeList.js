import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const FILTERS = ['All Recipes', 'Vegetarian', 'Non-Vegetarian'];

const SAMPLE_RECIPES = [
  { id: '1', name: 'Butter Chicken', servings: 1, ingredients: 7, price: 250, type: 'Non-Vegetarian' },
  { id: '2', name: 'Palak Paneer', servings: 1, ingredients: 6, price: 180, type: 'Vegetarian' },
];

const RECENTLY_SCANNED = [
  { id: '3', name: 'Paneer Tikka', scannedAgo: '2 min ago' },
];

export default function RecipeList({ onSelectRecipe, onBack, onScanMenu }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);

  const filteredRecipes = SAMPLE_RECIPES.filter(r =>
    (filter === 'All Recipes' || r.type === filter) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header with Back */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.title}>Recipe List</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={search}
        onChangeText={setSearch}
      />

      {/* OCR Scan Entry */}
      <TouchableOpacity style={styles.scanCard} onPress={onScanMenu}>
        <Ionicons name="camera" size={28} color="#007bff" />
        <Text style={styles.scanText}>Scan Menu to Auto-Fill Recipes</Text>
      </TouchableOpacity>

      {/* Recently Scanned */}
      {RECENTLY_SCANNED.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Scanned</Text>
          {RECENTLY_SCANNED.map(item => (
            <TouchableOpacity key={item.id} style={styles.recentItem}>
              <Text style={styles.recentName}>{item.name}</Text>
              <Text style={styles.recentAgo}>{item.scannedAgo}</Text>
              <Ionicons name="arrow-forward" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recipe List */}
      <FlatList
        data={filteredRecipes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeItem} onPress={() => onSelectRecipe(item)}>
            <View>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeSummary}>
                {item.servings} serving • {item.ingredients} ingredients
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.recipePrice}>₹{item.price}</Text>
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
          <MaterialIcons name="restaurant-menu" size={28} color="#007bff" />
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
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', marginLeft: 8 },
  searchBar: { backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 14, borderWidth: 1, borderColor: '#eee' },
  scanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0ff', borderRadius: 8, padding: 14, marginBottom: 14 },
  scanText: { marginLeft: 12, color: '#007bff', fontWeight: 'bold', fontSize: 16 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 4 },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 6 },
  recentName: { flex: 1, fontSize: 16, color: '#222' },
  recentAgo: { color: '#888', fontSize: 12, marginRight: 8 },
  filtersRow: { flexDirection: 'row', marginBottom: 8 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#eee', marginRight: 8 },
  filterBtnActive: { backgroundColor: '#007bff' },
  filterText: { color: '#555', fontSize: 15 },
  filterTextActive: { color: '#fff' },
  recipeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 10 },
  recipeName: { fontSize: 17, fontWeight: 'bold', color: '#222' },
  recipeSummary: { color: '#888', fontSize: 13 },
  recipePrice: { color: '#007bff', fontWeight: 'bold', fontSize: 15 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', marginTop: 10 },
});
