import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Card, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import api from '@/utils/api';
import PostCard from '@/components/PostCard';
import { Video } from 'expo-av'; // ✅ ADD THIS
import { REACT_APP_API_URL } from '@/constants/env'; // ✅ ADD THIS

const PostDetail: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const postRes = await api.get(`/api/posts/${id}`);
        const commentRes = await api.get(`/api/comments/${id}`);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error('Failed to fetch post details:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleComment = async () => {
    if (!content.trim()) return;

    try {
      const res = await api.post(`/api/comments/${id}`, { content });
      setComments((prev) => [res.data, ...prev]);
      setContent('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (!post) return <Text style={styles.loadingText}>Loading...</Text>;

  // ✅ Render audio/video if file is present
  const renderMedia = () => {
    if (!post?.file) return null;

    const mediaUri = `${REACT_APP_API_URL}/${post.file}`;
    const isAudio = post.file.endsWith('.mp3') || post.file.endsWith('.wav');
    const isVideo = post.file.endsWith('.mp4') || post.file.endsWith('.mov');

    if (isAudio) {
      return (
        <Video
          source={{ uri: mediaUri }}
          useNativeControls
          style={styles.audio}
        />
      );
    } else if (isVideo) {
      return (
        <Video
          source={{ uri: mediaUri }}
          useNativeControls
          style={styles.video}
          isLooping
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#121212' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Post Detail" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <PostCard post={post} onUpdate={setPost} showActions />

        {/* ✅ Render media directly under post */}
        {renderMedia()}

        {user && (
          <Card style={styles.commentCard}>
            <TextInput
              label="Write a comment"
              value={content}
              onChangeText={setContent}
              multiline
              style={styles.input}
            />
            <Button mode="contained" onPress={handleComment}>
              Submit Comment
            </Button>
          </Card>
        )}

        <View style={styles.commentList}>
          {comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet.</Text>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Image
                    source={{ uri: comment.user?.profile?.avatar || 'https://placehold.co/600x400' }}
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{comment.user?.username || 'Unknown User'}</Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    padding: 16,
    paddingTop: 24,
  },
  loadingText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
  commentCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  input: {
    backgroundColor: '#2c2c2c',
    marginBottom: 12,
    color: '#ffffff',
  },
  commentList: {
    marginTop: 8,
  },
  comment: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#2c2c2c',
  },
  username: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentContent: {
    color: '#ffffff',
    fontSize: 15,
  },
  noComments: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 16,
  },
  video: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  audio: {
    width: '100%',
    height: 70,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default PostDetail;
