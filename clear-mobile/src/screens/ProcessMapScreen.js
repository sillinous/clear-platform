import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'vehicles', name: 'Vehicles', icon: 'car' },
  { id: 'documents', name: 'Documents', icon: 'document' },
  { id: 'benefits', name: 'Benefits', icon: 'heart' },
  { id: 'business', name: 'Business', icon: 'briefcase' },
  { id: 'property', name: 'Property', icon: 'home' },
  { id: 'courts', name: 'Courts', icon: 'hammer' },
];

const processes = [
  {
    id: 'drivers-license',
    title: "Driver's License Renewal",
    category: 'vehicles',
    difficulty: 'easy',
    time: '1-2 hours',
    cost: '$25-50',
    icon: 'car',
    color: '#3b82f6',
  },
  {
    id: 'vehicle-registration',
    title: 'Vehicle Registration',
    category: 'vehicles',
    difficulty: 'easy',
    time: '30 min - 1 hour',
    cost: '$50-200',
    icon: 'document-text',
    color: '#3b82f6',
  },
  {
    id: 'passport',
    title: 'Passport Application',
    category: 'documents',
    difficulty: 'moderate',
    time: '6-11 weeks',
    cost: '$165',
    icon: 'airplane',
    color: '#8b5cf6',
  },
  {
    id: 'birth-certificate',
    title: 'Birth Certificate Copy',
    category: 'documents',
    difficulty: 'easy',
    time: '1-4 weeks',
    cost: '$10-30',
    icon: 'person',
    color: '#8b5cf6',
  },
  {
    id: 'real-id',
    title: 'REAL ID Application',
    category: 'documents',
    difficulty: 'moderate',
    time: '1-3 hours',
    cost: '$30-60',
    icon: 'id-card',
    color: '#8b5cf6',
  },
  {
    id: 'snap-benefits',
    title: 'SNAP Benefits',
    category: 'benefits',
    difficulty: 'moderate',
    time: '30 days',
    cost: 'Free',
    icon: 'nutrition',
    color: '#10b981',
  },
  {
    id: 'medicaid',
    title: 'Medicaid Application',
    category: 'benefits',
    difficulty: 'moderate',
    time: '45 days',
    cost: 'Free',
    icon: 'medkit',
    color: '#10b981',
  },
  {
    id: 'unemployment',
    title: 'Unemployment Benefits',
    category: 'benefits',
    difficulty: 'moderate',
    time: '2-4 weeks',
    cost: 'Free',
    icon: 'cash',
    color: '#10b981',
  },
  {
    id: 'business-license',
    title: 'Business License',
    category: 'business',
    difficulty: 'moderate',
    time: '2-4 weeks',
    cost: '$50-500',
    icon: 'storefront',
    color: '#f59e0b',
  },
  {
    id: 'sales-tax',
    title: 'Sales Tax Permit',
    category: 'business',
    difficulty: 'easy',
    time: '1-2 weeks',
    cost: 'Free-$25',
    icon: 'receipt',
    color: '#f59e0b',
  },
  {
    id: 'homestead',
    title: 'Homestead Exemption',
    category: 'property',
    difficulty: 'easy',
    time: '2-4 weeks',
    cost: 'Free',
    icon: 'home',
    color: '#06b6d4',
  },
  {
    id: 'property-tax-appeal',
    title: 'Property Tax Appeal',
    category: 'property',
    difficulty: 'moderate',
    time: '2-6 months',
    cost: 'Free-$100',
    icon: 'trending-down',
    color: '#06b6d4',
  },
  {
    id: 'name-change',
    title: 'Legal Name Change',
    category: 'courts',
    difficulty: 'moderate',
    time: '2-3 months',
    cost: '$150-500',
    icon: 'create',
    color: '#ef4444',
  },
  {
    id: 'small-claims',
    title: 'Small Claims Court',
    category: 'courts',
    difficulty: 'moderate',
    time: '1-3 months',
    cost: '$30-100',
    icon: 'hammer',
    color: '#ef4444',
  },
  {
    id: 'expungement',
    title: 'Record Expungement',
    category: 'courts',
    difficulty: 'hard',
    time: '3-6 months',
    cost: '$100-400',
    icon: 'trash',
    color: '#ef4444',
  },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return '#22c55e';
    case 'moderate': return '#eab308';
    case 'hard': return '#ef4444';
    default: return '#64748b';
  }
};

export default function ProcessMapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigation = useNavigation();

  const filteredProcesses = processes.filter((process) => {
    const matchesSearch = process.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || process.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProcess = ({ item }) => (
    <TouchableOpacity
      style={styles.processCard}
      onPress={() => navigation.navigate('ProcessDetail', { 
        processId: item.id, 
        title: item.title,
        process: item 
      })}
      activeOpacity={0.7}
    >
      <View style={[styles.processIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.processContent}>
        <Text style={styles.processTitle}>{item.title}</Text>
        <View style={styles.processMetaRow}>
          <View style={styles.processMeta}>
            <Ionicons name="time" size={14} color="#64748b" />
            <Text style={styles.processMetaText}>{item.time}</Text>
          </View>
          <View style={styles.processMeta}>
            <Ionicons name="cash" size={14} color="#64748b" />
            <Text style={styles.processMetaText}>{item.cost}</Text>
          </View>
        </View>
      </View>
      <View style={styles.processRight}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search processes..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.id ? '#3b82f6' : '#64748b'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProcesses.length} process{filteredProcesses.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {/* Process List */}
      <FlatList
        data={filteredProcesses}
        renderItem={renderProcess}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#334155" />
            <Text style={styles.emptyText}>No processes found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#e2e8f0',
    fontSize: 16,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#3b82f6',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748b',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  processCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  processIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  processContent: {
    flex: 1,
  },
  processTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  processMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  processMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  processMetaText: {
    fontSize: 12,
    color: '#64748b',
  },
  processRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
});
