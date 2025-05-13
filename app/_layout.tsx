import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
    <PaperProvider theme={DarkTheme}>
      <StatusBar style="light" backgroundColor="#000" />
      <Slot />
    </PaperProvider>
    </AuthProvider>
  );
} 