import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, Avatar, Title, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { router } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { REACT_APP_API_URL } from '@/constants/env';
const Account = () => {
  const { user, logout } = useContext(AuthContext);
  const userId = user?.id;
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/api/users/profile/${userId}`);
        setProfile(res.data);
        setUsername(res.data.username);
        setBio(res.data.profile?.bio || '');
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleAvatarPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (avatar) {
      const localUri = avatar.uri;
      const filename = localUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('avatar', {
        uri: localUri,
        name: filename,
        type,
      } as any);
    }

    try {
      const res = await axios.patch(
        `${REACT_APP_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile(res.data.user);
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginTop:24,fontSize:24, fontWeight: "bold" }}>Account</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Account</Title>

      <Card style={styles.card}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Image
            size={80}
            source={{
              uri: avatar?.uri
                ? avatar.uri
                : profile.profile?.avatar
                ? `${process.env.EXPO_PUBLIC_API_URL}/${profile.profile.avatar}`
                : 'https://via.placeholder.com/150',
            }}
          />
          <Button onPress={handleAvatarPick} mode="text" textColor="#2196f3" style={{ marginTop: 8 }}>
            Change Avatar
          </Button>
          <Title style={{ color: 'white', marginTop: 4 }}>{profile.username}</Title>
          <Text style={{ color: 'gray' }}>{profile.profile?.bio}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleUpdate} style={{ marginTop: 12 }}>
            Update Profile
          </Button>
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={handleLogout} style={styles.logout}>
        Logout
      </Button>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
  },
  logout: {
    marginTop: 16,
    borderColor: '#f44336',
    borderWidth: 1,
  },
});
