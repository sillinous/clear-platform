import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const tools = [
  {
    id: 'plainspeak',
    name: 'PlainSpeak AI',
    description: 'Translate legal jargon into plain language',
    icon: 'document-text',
    color: '#8b5cf6',
    screen: 'PlainSpeak',
  },
  {
    id: 'processmap',
    name: 'ProcessMap',
    description: 'Navigate government processes step-by-step',
    icon: 'map',
    color: '#06b6d4',
    screen: 'ProcessMap',
  },
  {
    id: 'calculator',
    name: 'Complexity Calculator',
    description: 'Measure any process using CLEAR methodology',
    icon: 'calculator',
    color: '#10b981',
    screen: 'Calculator',
  },
];

const stats = [
  { label: 'Processes Mapped', value: '18+' },
  { label: 'Risk Patterns', value: '20+' },
  { label: 'States Covered', value: '50' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="scale" size={32} color="white" />
          </View>
        </View>
        <Text style={styles.heroTitle}>CLEAR Platform</Text>
        <Text style={styles.heroSubtitle}>
          Making legal and administrative processes accessible to everyone
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tools</Text>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={() => navigation.navigate(tool.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
              <Ionicons name={tool.icon} size={24} color={tool.color} />
            </View>
            <View style={styles.toolContent}>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('PlainSpeak')}
          >
            <Ionicons name="flash" size={20} color="#facc15" />
            <Text style={styles.quickActionText}>Translate Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('ProcessMap')}
          >
            <Ionicons name="search" size={20} color="#3b82f6" />
            <Text style={styles.quickActionText}>Find Process</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mission */}
      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>Our Mission</Text>
        <Text style={styles.missionText}>
          We believe everyone deserves to understand the rules that govern their lives. 
          CLEAR tools translate complexity into clarity.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Coalition for Legal & Administrative Reform
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  missionCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
