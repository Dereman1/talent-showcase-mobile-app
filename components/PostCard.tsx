import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button, Avatar, Divider, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Icon imports
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/utils/api';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

interface PostCardProps {
  post: any;
  onUpdate: (updatedPost: any) => void;
  showActions?: boolean;
  evaluation?: any;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, showActions = true, evaluation = null }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Handle Like functionality
  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      onUpdate?.(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const avatarUrl = post.user?.profile?.avatar
    ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
    : '/assets/default-avatar.png';

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar.Image size={40} source={{ uri: avatarUrl }} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: post.user._id })}>
            <Text style={styles.viewProfile}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>
        {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
        {post.content.length > 100 && (
          <TouchableOpacity onPress={() => navigation.navigate('Post', { postId: post._id })}>
            <Text style={styles.seeMore}> See more</Text>
          </TouchableOpacity>
        )}
      </Text>

      {post.file && (
        <View style={styles.media}>
          {post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? (
            <audio src={`${process.env.REACT_APP_API_URL}/${post.file}`} controls />
          ) : (
            <Image source={{ uri: `${process.env.REACT_APP_API_URL}/${post.file}` }} style={styles.mediaImage} />
          )}
        </View>
      )}

      {showActions && (
        <View style={styles.actions}>
          <Button
            icon="thumb-up"
            mode="text"
            onPress={handleLike}
            disabled={!user}
            style={styles.likeButton}
          >
            {post.likes.length} Likes
          </Button>
          <Button
            icon="comment"
            mode="text"
            onPress={() => navigation.navigate('Post', { postId: post._id })}
            disabled={!user}
          >
            Comments
          </Button>
        </View>
      )}

      {evaluation && (
        <View style={styles.evaluation}>
          <Divider />
          <Text style={styles.score}>Score: {evaluation.score}/10</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
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
  },
  viewProfile: {
    fontSize: 12,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#555',
  },
  seeMore: {
    color: '#007AFF',
  },
  media: {
    marginTop: 12,
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  likeButton: {
    flex: 1,
    textAlign: 'left',
  },
  evaluation: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default PostCard;
