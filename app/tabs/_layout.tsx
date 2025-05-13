import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme } from '@/constants/theme';
import * as SystemUI from 'expo-system-ui';

export default function TabsLayout() {
  useEffect(() => {
    // Set the navigation bar color (Android only)
    SystemUI.setBackgroundColorAsync('#121212');
  }, []);

  return (
    <PaperProvider theme={DarkTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1976d2',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#222', // Optional: subtle top border
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="ranks"
          options={{
            title: 'Ranks',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="leaderboard" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="message" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="notifications" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
