import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Searchbar,
  Avatar,
  Card,
  Divider,
  Button,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { useRouter } from 'expo-router';
import { REACT_APP_API_URL } from '@/constants/env';

// Interfaces
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

const RanksScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<
    { post: Post; finalScore: number; userScore: number; judgeScore: number }[]
  >([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
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

  useEffect(() => {
    const filtered = categories
      .filter(({ category }) => selectedCategory === 'All' || category === selectedCategory)
      .flatMap(({ top10 }) =>
        top10.filter(({ post }) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, categories]);

  const handleProfileNavigation = (userId: string) => {
    if (userId === user?._id) {
      router.push('/tabs/account');
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { post, finalScore, userScore, judgeScore } = item;
    return (
      <Card key={post._id} style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
                  <Avatar.Image size={40} source={{ uri:  post.user?.profile?.avatar
    ? `${REACT_APP_API_URL}/${post.user.profile.avatar}`
    : 'https://via.placeholder.com/40' }} />
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{post.user.username}</Text>
                    <TouchableOpacity onPress={() => {
            if (post.user._id === user?._id) {
              router.push('/tabs/account');
            } 
          }}>
            <Text style={styles.viewProfile}>View Profile</Text>
          </TouchableOpacity>
          
                  </View>
                  <Text style={styles.score}>
                     #{index + 1} — Score: {finalScore.toFixed(2)}
                    </Text>
                </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>
            {post.content.length > 200
              ? `${post.content.slice(0, 200)}...`
              : post.content}
          </Text>

          {post.file && (
            <View style={styles.mediaContainer}>
              {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                <Image source={{ uri: post.file }} style={styles.image} />
              ) : post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? (
                <Text>Audio Player Placeholder</Text>
              ) : post.file.endsWith('.mp4') ? (
                <Text>Video Player Placeholder</Text>
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
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Content */}
      <View style={styles.fixedTop}>
        <Searchbar
          placeholder="Search posts"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={styles.searchbar}
        />
        <View style={styles.categoryWrapper}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value: string) => setSelectedCategory(value)}
            style={styles.categorySelector}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="All Categories" value="All" />
            <Picker.Item label="Literal Art" value="literal" />
            <Picker.Item label="Vocal Art" value="vocal" />
            <Picker.Item label="Visual Art" value="visual" />
          </Picker>
        </View>
        <Text style={styles.title}>Top Ranked {selectedCategory} Posts</Text>
      </View>

      {/* Scrollable List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.post._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center' }}>No posts available</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  fixedTop: {
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  searchbar: {
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: '#333',
    borderRadius: 100,
  },
  categoryWrapper: {
    backgroundColor: '#333',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 12,
  },
  categorySelector: {
    width: '100%',
    height: 50,
    color: '#fff',
    paddingLeft: 12,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
  },
 header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    
  },
  viewProfile: {
    fontSize: 12,
    color: '#90caf9',
    
  },
  
  profileButton: {
    padding: -14,
    marginTop: 0,
    color: '#00bcd4',
  },
  score: {
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    right: 16,
    top: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  postContent: {
    fontSize: 14,
    marginBottom: 8,
    color: '#ccc',
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
    backgroundColor: '#333',
  },
  scores: {
    fontSize: 14,
    color: '#bbb',
  },
});

export default RanksScreen;
