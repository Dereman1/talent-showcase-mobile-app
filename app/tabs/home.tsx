import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Searchbar, PaperProvider, Dialog, Button, Avatar, Card, Divider } from 'react-native-paper';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/utils/api';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostForm';
import { DarkTheme } from '@/constants/theme';
const colors = DarkTheme.colors.primary;
// Define types for post and user
interface User {
  _id: string;
  username: string;
  profile?: {
    avatar?: string;
  };
}

interface Post {
  _id: string;
  title: string;
  content: string;
  category: 'literal' | 'visual' | 'vocal';
  file?: string;
  likes: string[];
  user: User;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'literal', label: 'Literal' },
  { value: 'visual', label: 'Visual' },
  { value: 'vocal', label: 'Vocal' },
];

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get<Post[]>('/api/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const inCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      return inCategory && matchesSearch;
    });
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, search]);

  const handlePostCreated = (newPost: Post) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    setOpenDialog(false);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    const updated = posts.map((p) => (p._id === updatedPost._id ? updatedPost : p));
    setPosts(updated);
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.filters}>
          <Searchbar
            placeholder="Search posts"
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={styles.searchbar}
          />
          <View style={styles.categoryPicker}>
            {categories.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.categoryButton,
                  selectedCategory === option.value && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(option.value)}
              >
                <Text style={styles.categoryText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button mode="contained" onPress={handleDialogOpen} style={{ backgroundColor: colors }} labelStyle={{ color: "#fff" }}>Create Post</Button>
        </View>

        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => (
            <PostCard key={item._id} post={item} onUpdate={handlePostUpdate} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.postList}
        />

        <Dialog style={{backgroundColor: '#121212'}}  visible={openDialog} onDismiss={handleDialogClose}>
          <Dialog.Title>Create New Post</Dialog.Title>
          <Dialog.Content >
            <PostForm onPostCreated={handlePostCreated} />
          </Dialog.Content>
        </Dialog>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  filters: {
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 12,
    marginTop: 24,
    backgroundColor: '#333',
  },
  categoryPicker: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 8,
    borderRadius: 48,
  },
  selectedCategory: {
    backgroundColor: '#1976d2',
  },
  categoryText: {
    color: '#fff',
  },
  postList: {
    paddingBottom: 100,
  },
});

export default HomeScreen;
