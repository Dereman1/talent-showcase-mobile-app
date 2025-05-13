import { FC, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

const HomeScreen: FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Replace with your API call
      // const res = await axios.post('/api/auth/register', { username, email, password });
      // AsyncStorage.setItem('token', res.data.token);
      // router.push('/verify-otp');
      console.log('Registering...');
    } catch (err) {
      console.error('Error registering:', err);
      Alert.alert('Error', 'Registration failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Register" titleStyle={styles.cardTitle} />
        <Card.Content>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
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
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => router.push('/login')}>
              Login
            </Text>
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

export default HomeScreen;
