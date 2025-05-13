import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Searchbar, Avatar, Card, Divider } from 'react-native-paper'; // Updated imports
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '@/utils/api';

// TypeScript Interfaces
interface UserProfile {
  avatar: string;
  username: string;
  _id: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  file: string;
  user: UserProfile;
}

interface Category {
  category: string;
  top10: { post: Post; finalScore: number; userScore: number; judgeScore: number }[];
}

// Navigation Param Types
type RootStackParamList = {
  Profile: { userId: string };
};

const RanksScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // Default to 'All'
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<
    { post: Post; finalScore: number; userScore: number; judgeScore: number }[]
  >([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await api.get('/api/judge/top-ranked');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load top posts:', err);
      }
    };
    fetchTopPosts();
  }, []);

  // Filter posts based on search term and selected category
  useEffect(() => {
    const filtered = categories
      .filter(({ category }) => selectedCategory === 'All' || category === selectedCategory)
      .flatMap(({ top10 }) =>
        top10.filter(({ post }) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, categories]);

  const handleProfileNavigation = (userId: string) => {
    navigation.navigate('Profile', { userId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        {/* Search Bar with Top Margin */}
        <Searchbar
          placeholder="Search posts"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={styles.searchbar}
        />

        {/* Category Select Dropdown */}
        <View style={styles.categoryWrapper}>
        <Picker
  selectedValue={selectedCategory}
  onValueChange={(value: string) => setSelectedCategory(value)}
  style={styles.categorySelector}
  dropdownIconColor="#fff" // Set the dropdown arrow color to white
>
  <Picker.Item label="All Categories" value="All" />
  <Picker.Item label="Literal Art" value="literal" />
  <Picker.Item label="Vocal Art" value="vocal" />
  <Picker.Item label="Visual Art" value="visual" />
</Picker>
</View>

      </View>

      <Text style={styles.title}>Top Ranked {selectedCategory} Posts</Text>

      {filteredPosts.length > 0 ? (
        filteredPosts.map(({ post, finalScore, userScore, judgeScore }, index) => (
          <Card key={post._id} style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <Avatar.Image
                  source={{
                    uri: post.user?.avatar
                      ? `${process.env.REACT_APP_API_URL}/${post.user.avatar}`
                      : '/assets/default-avatar.png',
                  }}
                  size={40}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.username}>{post.user.username}</Text>
                  <Button
                    onPress={() => handleProfileNavigation(post.user._id)}
                    mode="text"
                    style={styles.profileButton}
                  >
                    View Profile
                  </Button>
                </View>
                <Text style={styles.score}>#{index + 1} — Score: {finalScore.toFixed(2)}</Text>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>
                {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
              </Text>

              {post.file && (
                <View style={styles.mediaContainer}>
                  {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                    <Image source={{ uri: post.file }} style={styles.image} />
                  ) : post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? (
                    <Text>Audio Player Placeholder</Text> // Placeholder for AudioPlayer component
                  ) : post.file.endsWith('.mp4') ? (
                    <Text>Video Player Placeholder</Text> // Placeholder for VideoPlayer component
                  ) : (
                    <Text>Unsupported media format</Text>
                  )}
                </View>
              )}

              <Divider style={styles.divider} />
              <Text style={styles.scores}>
                User Score: {userScore.toFixed(2)} | Judge Score: {judgeScore.toFixed(2)}
              </Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={{ color: "#fff" }}>No posts available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212', // Dark background for consistency
    height: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  searchbar: {
    marginTop: 20, // Added top margin to search bar
    marginBottom: 16,
    backgroundColor: '#333', // Dark background for input field
    borderRadius: 100, // Make it rounded
  },
  categoryWrapper: {
  backgroundColor: '#333', // Dark background for the category select box
  borderRadius: 30, // Rounded corners for the wrapper
  overflow: 'hidden', // Ensures that the child picker inherits the rounded corners
},

categorySelector: {
  width: '100%',
  height: 50,
  color: '#fff', // White text
  paddingLeft: 12, // Add some padding to make the text look better
  backgroundColor: '#333', // Same dark background to match
}
,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff', // White text for title
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e', // Dark background for cards
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    color: '#fff', // White text for username
  },
  profileButton: {
    padding: 0,
    marginTop: 4,
    color: '#00bcd4', // Button color (can adjust)
  },
  score: {
    fontWeight: 'bold',
    color: '#fff', // White text for score
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff', // White text for post title
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ccc', // Lighter color for post content
  },
  mediaContainer: {
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#333', // Divider color
  },
  scores: {
    fontSize: 14,
    color: '#bbb', // Light gray color for scores
  },
});

export default RanksScreen;
