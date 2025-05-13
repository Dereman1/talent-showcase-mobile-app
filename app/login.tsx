// app/login.tsx
import { FC, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { Link } from 'expo-router';

const LoginScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // Handle login logic here
    console.log("Logging in...");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Login" titleStyle={styles.cardTitle} />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Text variant="bodyMedium" style={styles.registerText}>
            Don't have an account?{' '}
          </Text>
          <Link href="/" style={styles.registerLink}>
            Register
          </Link>
        </Card.Actions>
        <Card.Actions style={styles.cardActions}>
          
          <Link href="/" style={styles.registerLink}>
            Forgot Password
          </Link>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  cardActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontWeight: 'bold',
    color: '#6200ee',
    fontSize: 14,
  },
});

export default LoginScreen;
