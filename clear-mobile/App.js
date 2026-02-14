import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlainSpeakScreen from './src/screens/PlainSpeakScreen';
import ProcessMapScreen from './src/screens/ProcessMapScreen';
import ProcessDetailScreen from './src/screens/ProcessDetailScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

// Theme
const theme = {
  dark: true,
  colors: {
    primary: '#3b82f6',
    background: '#0f172a',
    card: '#1e293b',
    text: '#e2e8f0',
    border: '#334155',
    notification: '#3b82f6',
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Process Stack Navigator
function ProcessStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen 
        name="ProcessList" 
        component={ProcessMapScreen} 
        options={{ title: 'ProcessMap' }}
      />
      <Stack.Screen 
        name="ProcessDetail" 
        component={ProcessDetailScreen}
        options={({ route }) => ({ title: route.params?.title || 'Process' })}
      />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'PlainSpeak') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'ProcessMap') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#e2e8f0',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="PlainSpeak" component={PlainSpeakScreen} />
      <Tab.Screen 
        name="ProcessMap" 
        component={ProcessStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Calculator" component={CalculatorScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <MainTabs />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
