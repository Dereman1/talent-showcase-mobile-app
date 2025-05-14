import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageItem = ({ message, userId }: { message: any; userId: string }) => {
  const isCurrentUser = message.sender._id === userId;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.rightAlign : styles.leftAlign,
      ]}
    >
      <View style={styles.bubbleContainer}>
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
          ]}
        >
          <Text style={styles.messageText}>{message.content}</Text>
        </View>
        <Text style={styles.timestamp}>{ new Date(message.timestamp).toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '100%',
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  bubbleContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 12,
  },
  currentUserBubble: {
    backgroundColor: '#2979ff',
    borderTopRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: '#333',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  timestamp: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 2,
    marginLeft: 4,
  },
});
