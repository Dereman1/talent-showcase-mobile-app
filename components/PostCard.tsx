import React, { useContext, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Button, Avatar, Divider, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { REACT_APP_API_URL } from '@/constants/env';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { Audio, Video, ResizeMode } from 'expo-av';

interface PostCardProps {
  post: any;
  onUpdate: (updatedPost: any) => void;
  showActions?: boolean;
  evaluation?: any;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate, showActions = true, evaluation = null }) => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const router = useRouter();
  const { id: postId } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const avatarUrl = post.user?.profile?.avatar
    ? `${REACT_APP_API_URL}/${post.user.profile.avatar}`
    : 'https://via.placeholder.com/40';

  const fileUrl = `${REACT_APP_API_URL}/uploads/${post.file}`;

  const handleLike = async () => {
    if (!user) return Alert.alert('Login Required', 'Please login to like posts.');
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      onUpdate?.({ ...response.data, user: post.user });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = () => {
    if (!user) return Alert.alert('Login Required', 'Please login to comment.');
    router.push({ pathname: '/post/[id]', params: { id: post._id } });
  };

  const toggleAudio = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: fileUrl });
        soundRef.current = sound;
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Audio error:', err);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar.Image size={40} source={{ uri: avatarUrl }} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          <TouchableOpacity
            onPress={() => {
              if (post.user?.id === user?.id) {
                router.push('/tabs/account');
              } else {
                router.push({ pathname: '/profile/[id]', params: { id: post.user._id } });
              }
            }}
          >
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
            <Button mode="outlined" onPress={toggleAudio}>
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </Button>
          ) : post.file.endsWith('.mp4') || post.file.endsWith('.mov') ? (
            <Video
              source={{ uri: fileUrl }}
              style={styles.mediaVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          ) : (
            <Image source={{ uri: fileUrl }} style={styles.mediaImage} />
          )}
        </View>
      )}

      {showActions && (
        <View style={styles.actions}>
          <Button
            icon="thumb-up"
            mode="contained-tonal"
            onPress={handleLike}
            style={styles.actionButton}
            textColor="#2196f3"
          >
            {post.likes.length} Likes
          </Button>

          <Button
            icon="comment"
            mode="contained-tonal"
            onPress={handleComment}
            style={styles.actionButton}
            textColor="#2196f3"
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
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#cfcfcf',
  },
  seeMore: {
    color: '#64b5f6',
  },
  media: {
    marginTop: 12,
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  mediaVideo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  evaluation: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#81c784',
  },
});

export default PostCard;
