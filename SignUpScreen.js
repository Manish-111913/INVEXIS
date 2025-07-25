import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function SignUpScreen({ onBack, onSignUp }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ImageBackground
      source={require('./assets/image.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.title}>INVEXIS</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <View style={styles.cautionBox}>
            <Text style={styles.cautionText}>
              Caution: For personal devices only. Do not use on shared terminals.
            </Text>
          </View>
          <TouchableOpacity style={styles.signUpButton} onPress={() => onSignUp({ name, email, password, confirmPassword })}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 2, marginBottom: 32 },
  form: {
    backgroundColor: 'rgba(255,255,255,0.65)',
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
  cautionBox: {
    backgroundColor: 'rgba(255, 221, 51, 0.35)', // transparent yellow
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  cautionText: { color: '#222', fontSize: 13, fontWeight: 'bold' },
  signUpButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signUpText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backText: { color: '#222', textAlign: 'center', marginTop: 8, textDecorationLine: 'underline', fontSize: 15 },
});