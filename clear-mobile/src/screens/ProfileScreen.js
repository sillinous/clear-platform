import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useSettingsStore from '../store/settingsStore';

const menuItems = [
  { id: 'settings', icon: 'settings', label: 'Settings', screen: 'Settings' },
  { id: 'history', icon: 'time', label: 'Translation History', badge: '12' },
  { id: 'saved', icon: 'bookmark', label: 'Saved Processes', badge: '3' },
  { id: 'submissions', icon: 'cloud-upload', label: 'My Submissions' },
];

const statsData = [
  { label: 'Translations', value: '24', icon: 'document-text', color: '#8b5cf6' },
  { label: 'Processes', value: '5', icon: 'map', color: '#06b6d4' },
  { label: 'Calculations', value: '8', icon: 'calculator', color: '#10b981' },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { apiKey } = useSettingsStore();
  
  const isLoggedIn = false; // Would come from auth context

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleMenuItem = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Coming Soon', `${item.label} will be available in a future update.`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#64748b" />
          </View>
        </View>
        
        {isLoggedIn ? (
          <>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </>
        ) : (
          <>
            <Text style={styles.guestText}>Guest User</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* API Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusInfo}>
            <View style={[styles.statusDot, { backgroundColor: apiKey ? '#22c55e' : '#64748b' }]} />
            <Text style={styles.statusLabel}>AI Status</Text>
          </View>
          <Text style={[styles.statusValue, { color: apiKey ? '#22c55e' : '#64748b' }]}>
            {apiKey ? 'Connected' : 'Demo Mode'}
          </Text>
        </View>
        {!apiKey && (
          <TouchableOpacity 
            style={styles.configureButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.configureText}>Configure API Key</Text>
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {statsData.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItem(item)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={22} color="#94a3b8" />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <View style={styles.linkGrid}>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="help-circle" size={24} color="#3b82f6" />
            <Text style={styles.linkText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#10b981" />
            <Text style={styles.linkText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="document-text" size={24} color="#f59e0b" />
            <Text style={styles.linkText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="information-circle" size={24} color="#8b5cf6" />
            <Text style={styles.linkText}>About</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>CLEAR Platform v1.0.0</Text>
        <Text style={styles.footerSubtext}>Coalition for Legal & Administrative Reform</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
  },
  guestText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  configureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  configureText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  menuSection: {
    margin: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLabel: {
    fontSize: 15,
    color: '#e2e8f0',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
  },
  linkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkCard: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  linkText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
});
