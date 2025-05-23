import React, { FC, useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path if needed
import { REACT_APP_API_URL } from '@/constants/env';


const LoginScreen: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      // Optional: Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Call login function from context
      login(user, token);

      // Navigate to home tab
      router.replace('/tabs/home');
    } catch (err: any) {
      console.log('Login error:', err);
      const message = err.response?.data?.message || 'Login failed';
      setErrorMsg(message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Login" titleStyle={styles.cardTitle} />
        <Card.Content>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>

          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text style={styles.link} onPress={() => router.push('/')}>
              Register
            </Text>
          </Text>

          <Text
            style={[styles.link, { textAlign: 'center', marginTop: 8 }]}
            onPress={() => router.push('/forgot-password')}
          >
            Forgot password?
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#ffffff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 12,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#ffffff',
  },
  link: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
