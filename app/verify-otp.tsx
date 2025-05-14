import { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/utils/api';

const VerifyOtpScreen: FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    setError('');
    setSuccess('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.post(
        `/api/auth/verify-otp`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(res.data.message);
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.post(
        `/api/auth/resend-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(res.data.message);
    } catch (err: any) {
      console.error('Resend error:', err);
      setError(err.response?.data?.message || 'Error resending OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Verify OTP" titleStyle={styles.title} />
        <Card.Content>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TextInput
            label="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            mode="outlined"
            style={styles.input}
            keyboardType="number-pad"
          />

          <Button mode="contained" onPress={handleVerify} style={styles.button}>
            Verify OTP
          </Button>

          <Text
            onPress={handleResend}
            style={[styles.link, { textAlign: 'center', marginTop: 12 }]}
          >
            Didn’t receive the code? Resend OTP
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
    marginTop: 4,
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

export default VerifyOtpScreen;
