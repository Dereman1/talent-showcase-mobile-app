
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, Avatar, Card, Button, TextInput, Divider } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { REACT_APP_API_URL } from '../../constants/env';
const categoryOptions = ['visual', 'vocal', 'literal'];

const AccountScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = id || user?.id;
        const res = await api.get(`/api/users/${uid}`);
        setProfile(res.data);
        setUsername(res.data.username);
        setBio(res.data.profile.bio);

        const postsRes = await api.get(`/api/posts/user/${uid}`);
        setPosts(postsRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [id, user]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    try {
      const res = await api.patch('/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data.user);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCat = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (!profile) return <Text style={{ color: '#000' }}>Loading...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <Text style={{ color: '#ddd', fontSize: 24, margin: 26 }}>
Account
      </Text>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar.Image
            size={80}
            source={
              profile.profile.avatar
                ? { uri: `${REACT_APP_API_URL}/${profile.profile.avatar}` }
                : require('../../assets/images/icon.png')
            }
          />
          <View style={{ marginLeft: 16 }}>
            <Text variant="titleMedium">{profile.username.toUpperCase()}</Text>
            <Text variant="bodyMedium">{profile.profile.bio}</Text>
          </View>
        </View>
        {/* Self-profile editable */}
        {user?.id === profile._id && (
          <Card style={styles.card}>
            <Card.Title title="Update Profile" />
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
                multiline
                numberOfLines={3}
                mode="outlined"
                style={styles.input}
              />
              <Button
                icon="image"
                mode="outlined"
                onPress={() => {
                  // Add image picker if desired
                }}
                style={{ marginBottom: 16 }}
              >
                Upload Avatar
              </Button>
              <Button mode="contained" onPress={handleUpdate}>
                Save Changes
              </Button>
              <Divider style={{ marginVertical: 16 }} />
              <TouchableOpacity onPress={() => router.push('/change-password')}>
                <Text style={styles.link}>Change Password</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )}
        {/* Post Filters */}
        {profile.role === 'user' && (
          <>
            <Card style={styles.card}>
              <Card.Title title="Filter Posts" />
              <Card.Content>
                <RNTextInput
                  placeholder="Search posts"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  style={styles.input}
                  placeholderTextColor="#aaa"
                />
                <View style={styles.categoryRow}>
                  {categoryOptions.map(cat => (
                    <Button
                      key={cat}
                      mode={selectedCategory === cat ? 'contained' : 'outlined'}
                      onPress={() => setSelectedCategory(cat)}
                      style={styles.categoryBtn}
                    >
                      {cat}
                    </Button>
                  ))}
                </View>
              </Card.Content>
            </Card>
            {/* Posts */}
            <FlatList
              data={filteredPosts}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <Card style={styles.postCard}>
                  <Card.Title title={item.title} subtitle={item.category} />
                  <Card.Content>
                    <Text>{item.description}</Text>
                  </Card.Content>
                </Card>
              )}
              ListEmptyComponent={<Text style={{ marginTop: 20 }}>No posts found.</Text>}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 64,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e1e1e',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  link: {
    color: '#1976d2',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryBtn: {
    marginRight: 8,
    marginTop: 8,
  },
  postCard: {
    backgroundColor: '#1e1e1e',
    marginBottom: 12,
  },
});
