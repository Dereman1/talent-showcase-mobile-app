// app/change-password.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../utils/api';
import { AuthContext } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const res = await api.post(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(res.data.message);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error changing password');
      setSuccess('');
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/tabs/account');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Card style={styles.card}>
          <Card.Title title="Change Password" titleStyle={{ color: '#fff', textAlign: 'center' }} />
          <Card.Content>
            <TextInput
              label="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
            />
            <TextInput
              label="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
            />
            <TextInput
              label="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { text: '#fff', placeholder: '#aaa' } }}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ marginTop: 16 }}
            >
              Change Password
            </Button>

            <Snackbar
              visible={!!error}
              onDismiss={() => setError('')}
              duration={3000}
              style={{ backgroundColor: '#d32f2f' }}
            >
              {error}
            </Snackbar>

            <Snackbar
              visible={!!success}
              onDismiss={() => setSuccess('')}
              duration={2000}
              style={{ backgroundColor: '#388e3c' }}
            >
              {success}
            </Snackbar>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingBottom: 24,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#1e1e1e',
  },
});
