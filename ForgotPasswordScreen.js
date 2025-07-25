import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function ForgotPasswordScreen({ onBack, onSendReset }) {
  const [email, setEmail] = useState('');

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
          <Text style={styles.header}>Forgot password?</Text>
          <Text style={styles.instructions}>
            Enter your email to receive password reset instructions
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.resetButton} onPress={() => onSendReset(email)}>
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>&lt; Back to Login</Text>
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
  header: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8, textAlign: 'center' },
  instructions: { color: '#555', fontSize: 15, marginBottom: 16, textAlign: 'center' },
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
  resetButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  resetButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backText: { color: '#222', textAlign: 'center', marginTop: 8, textDecorationLine: 'underline', fontSize: 15 },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    bottom: 24,
  },
  link: { color: '#fff', fontSize: 13, textDecorationLine: 'underline' },
});