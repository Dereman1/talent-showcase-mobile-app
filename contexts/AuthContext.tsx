import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io, { Socket } from 'socket.io-client';
import { REACT_APP_SOCKET_URL } from '@/constants/env';

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  role: string;
  [key: string]: any;
}

// Define the shape of the notification
interface Notification {
  _id: string;
  message: string;
  [key: string]: any;
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  socket: Socket | null;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  socket: null,
  notifications: [],
  setNotifications: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');
        if (token && userData) {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);
          connectSocket(token, parsedUser.id);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    initializeAuth();
  }, []);

  const connectSocket = (token: string, userId: string) => {
    const newSocket = io(REACT_APP_SOCKET_URL, {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', userId);
    });

    newSocket.on('notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => newSocket.disconnect();
  };

  const login = async (userData: User, token: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    connectSocket(token, userData.id);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
    if (socket) socket.disconnect();
    setSocket(null);
    setNotifications([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, socket, notifications, setNotifications }}
    >
      {children}
    </AuthContext.Provider>
  );
};
