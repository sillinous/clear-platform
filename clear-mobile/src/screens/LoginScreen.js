import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (mode !== 'forgot' && !password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === 'forgot') {
        Alert.alert('Success', 'Password reset email sent!');
        setMode('login');
      } else {
        Alert.alert(
          'Demo Mode',
          'Authentication requires Supabase configuration. For now, continue in guest mode.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="scale" size={36} color="white" />
          </View>
          <Text style={styles.logoText}>CLEAR</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'forgot' && 'Reset Password'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'login' && 'Sign in to sync your data across devices'}
          {mode === 'signup' && 'Join CLEAR to save your progress'}
          {mode === 'forgot' && 'Enter your email to receive a reset link'}
        </Text>

        {/* OAuth Buttons */}
        {mode !== 'forgot' && (
          <>
            <TouchableOpacity style={styles.oauthButton}>
              <Ionicons name="logo-google" size={20} color="#ffffff" />
              <Text style={styles.oauthText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.oauthButton, styles.oauthButtonGithub]}>
              <Ionicons name="logo-github" size={20} color="#ffffff" />
              <Text style={styles.oauthText}>Continue with GitHub</Text>
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
          </>
        )}

        {/* Form */}
        {mode === 'signup' && (
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              placeholderTextColor="#64748b"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {mode !== 'forgot' && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#64748b" 
              />
            </TouchableOpacity>
          </View>
        )}

        {mode === 'signup' && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#64748b"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
        )}

        {/* Forgot Password Link */}
        {mode === 'login' && (
          <TouchableOpacity 
            style={styles.forgotButton}
            onPress={() => setMode('forgot')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? 'Please wait...' : 
              mode === 'login' ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              'Send Reset Link'
            }
          </Text>
          {!isLoading && <Ionicons name="arrow-forward" size={18} color="white" />}
        </TouchableOpacity>

        {/* Mode Switch */}
        <View style={styles.modeSwitch}>
          {mode === 'forgot' ? (
            <TouchableOpacity onPress={() => setMode('login')}>
              <Text style={styles.modeSwitchLink}>← Back to Sign In</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.modeSwitchText}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.modeSwitchLink}>
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Benefits */}
        {mode === 'signup' && (
          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>Why create an account?</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              <Text style={styles.benefitText}>Sync translations across devices</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              <Text style={styles.benefitText}>Save your process progress</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              <Text style={styles.benefitText}>Track complexity submissions</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#ea4335',
    borderRadius: 12,
    marginBottom: 12,
  },
  oauthButtonGithub: {
    backgroundColor: '#24292e',
  },
  oauthText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#64748b',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#e2e8f0',
    fontSize: 15,
  },
  eyeButton: {
    padding: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#334155',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  modeSwitchText: {
    color: '#64748b',
    fontSize: 14,
  },
  modeSwitchLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  benefits: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#e2e8f0',
  },
});
