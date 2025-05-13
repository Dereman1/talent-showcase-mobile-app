import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Message = {
  content: string;
  timestamp: string;
  sender: {
    _id: string;
    username: string;
    profile?: {
      avatar?: string;
    };
  };
};

type Props = {
  message: Message;
  userId: string;
};

const MessageItem: React.FC<Props> = ({ message, userId }) => {
  const isSent = message.sender._id === userId;

  return (
    <View style={[styles.container, isSent ? styles.sent : styles.received]}>
      <Image
        source={
          message.sender?.profile?.avatar
            ? { uri: message.sender.profile.avatar }
            : require('../assets/images/icon.png')
        }
        style={styles.avatar}
      />
      <View style={[styles.bubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
        <Text style={[styles.username, isSent ? styles.usernameSent : styles.usernameReceived]}>
          {message.sender?.username || 'Unknown'}
        </Text>
        <Text style={styles.content}>{message.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  sent: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  received: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  bubble: {
    maxWidth: '70%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bubbleSent: {
    backgroundColor: '#1976d2', // Blue
  },
  bubbleReceived: {
    backgroundColor: '#333', // Dark gray
  },
  username: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  usernameSent: {
    color: '#fff',
  },
  usernameReceived: {
    color: '#ddd',
  },
  content: {
    color: '#fff',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
    textAlign: 'right',
  },
});
