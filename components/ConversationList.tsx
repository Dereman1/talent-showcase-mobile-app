import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  _id: string;
  username: string;
  profile?: {
    avatar?: string;
  };
};

type Message = {
  content: string;
};

type Conversation = {
  _id: string;
  participants: User[];
  messages: Message[];
};

type Props = {
  conversations: Conversation[];
  onSelect: (id: string) => void;
};

const ConversationList: React.FC<Props> = ({ conversations, onSelect }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUserId(parsed.id);
      }
    };
    getUser();
  }, []);

  const renderItem = ({ item }: { item: Conversation }) => {
    const otherUser = item.participants.find((p) => p._id !== currentUserId);
    const lastMessage = item.messages?.[item.messages.length - 1]?.content || '';

    return (
      <TouchableOpacity style={styles.item} onPress={() => onSelect(item._id)}>
        <Image
          source={
            otherUser?.profile?.avatar
              ? { uri: otherUser.profile.avatar }
              : require('../assets/default-avatar.png') // fallback image
          }
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{otherUser?.username}</Text>
          <Text style={styles.preview} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={conversations}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

export default ConversationList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
});
