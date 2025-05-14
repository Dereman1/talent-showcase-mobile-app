import { FC, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '@/utils/api';

const ForgotPasswordScreen: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      
      const res = await api.post('/api/auth/forgot-password', { email });
      setSuccessMsg(res.data.message);
      console.log('Sending reset link...');
      setSuccessMsg('Reset link sent successfully');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Forgot Password" titleStyle={styles.cardTitle} />
        <Card.Content>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? (
            <Text style={styles.successText}>{successMsg}</Text>
          ) : null}

          <TextInput
            label="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
          />

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Send Reset Link
          </Button>

          <Text
            style={[styles.link, { textAlign: 'center', marginTop: 16 }]}
            onPress={() => router.push('/login')}
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
    padding: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 22,
    color: '#ffffff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#66bb6a',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
