import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import api from '@/utils/api'; // Your axios instance
import { REACT_APP_API_URL } from '@/constants/env';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const UserProfileScreen = () => {
  const { id } = useLocalSearchParams(); // ID from URL
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/${id}`);
        setProfile(res.data);
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        Alert.alert('Error', 'Unable to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  const goBack = () => router.back();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#64b5f6" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>User profile not found.</Text>
        <Button title="Go Back" onPress={goBack} />
      </View>
    );
  }

  const avatarUrl = profile?.profile?.avatar
    ? `${REACT_APP_API_URL}/${profile.profile.avatar}`
    : 'https://via.placeholder.com/80';

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
  <TouchableOpacity onPress={goBack}>
    <Ionicons name="arrow-back" size={28} color="#90caf9" />
  </TouchableOpacity>
</View>


      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Image size={80} source={{ uri: avatarUrl }} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{profile.username}</Text>
              <Text style={styles.email}>{profile.email}</Text>
            </View>
          </View>

          <Text style={styles.bio}>Bio: {profile.profile?.bio || 'No bio available'}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  backContainer: {
  marginTop: 16,
  marginBottom: 8,
}
,
  card: {
    backgroundColor: '#1e1e1e',
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#aaa',
  },
  bio: {
    marginTop: 8,
    color: '#bbb',
  },
});

export default UserProfileScreen;
