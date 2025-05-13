// app/_layout.tsx
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <PaperProvider theme={DarkTheme}>
      <StatusBar style="light" backgroundColor="#121212" />
      <Slot />
    </PaperProvider>
  );
}
