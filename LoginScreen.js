import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function LoginScreen({ onLogin, onForgotPassword, onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <ImageBackground
      source={require('./assets/image.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.languageBox}>
          <Text style={styles.languageText}>EN ▼</Text>
        </View>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.title}>INVEXIS</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.rememberRow}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
              <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]} />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.caution}>
            Caution: For personal devices only. Do not use on shared terminals.
          </Text>
          {/* Error message placeholder */}
          {/* <Text style={styles.errorText}>Incorrect email or password. Please try again.</Text> */}
          <TouchableOpacity style={styles.signInButton} onPress={onLogin}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>or</Text>
          <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomLinks}>
          <Text style={styles.link}>Terms of Service</Text>
          <Text style={styles.link}>Privacy Policy</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)', // <--- reduce opacity for more transparency
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 32,
  },
  form: {
    backgroundColor: 'rgba(255,255,255,0.65)', // <--- more transparent white
    padding: 24,
    borderRadius: 16,
    width: '90%',
    alignItems: 'stretch',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  checkboxBox: { width: 18, height: 18, borderWidth: 1, borderColor: '#888', marginRight: 8, borderRadius: 3 },
  checkboxChecked: { backgroundColor: '#007bff', borderColor: '#007bff' },
  rememberText: { color: '#333', fontSize: 15 },
  caution: { color: '#E2B400', fontSize: 12, marginBottom: 16 },
  signInButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signInText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forgotText: {
    color: '#222',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
  languageBox: {
    position: 'absolute',
    top: 40,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  languageText: { fontSize: 15, color: '#333' },
  orText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signUpText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    bottom: 24,
  },
  link: { color: '#fff', fontSize: 13, textDecorationLine: 'underline' },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
});
