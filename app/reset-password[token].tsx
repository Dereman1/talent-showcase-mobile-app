import { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/utils/api';

const ResetPasswordScreen: FC = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      await api.post(`/api/auth/reset-password/${token}`, { newPassword });
      setSuccessMsg('Password reset successful');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Reset Password" titleStyle={styles.title} />
        <Card.Content>
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Reset Password
          </Button>

          <Text
            onPress={() => router.push('/login')}
            style={[styles.link, { textAlign: 'center', marginTop: 16 }]}
          >
            Back to Login
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: '#66bb6a',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
