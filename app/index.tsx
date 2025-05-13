// app/index.js
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text variant="headlineMedium" style={{ color: 'blue' }}>Art Showcase Hub</Text>
    </View>
  );
}
